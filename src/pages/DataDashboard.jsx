import { useState, useEffect, useRef, useCallback } from "react";

const STAGES = [
  { key:"A", label:"Quotation"           },{ key:"B", label:"Costing"             },
  { key:"C", label:"Sales"              },{ key:"D", label:"Contracts"          },
  { key:"E", label:"Sales Order"        },{ key:"F", label:"Planning"           },
  { key:"G", label:"PQ"                 },{ key:"H", label:"Project Photos"     },
  { key:"I", label:"Samples"            },{ key:"J", label:"Material Submittal" },
  { key:"K", label:"Shop Drawings"      },{ key:"L", label:"Variations"         },
  { key:"M", label:"Dispatch"           },{ key:"N", label:"Suppliers"          },
  { key:"O", label:"Production"         },{ key:"P", label:"Delivery"           },
  { key:"Q", label:"MIR"                },{ key:"R", label:"WIR"                },
  { key:"S", label:"Payment Apps"       },{ key:"T", label:"Invoice"            },
  { key:"U", label:"Certificates"       },{ key:"V", label:"After Sales"        },
  { key:"W", label:"Maintenance"        },
];

const S_CYCLE = ["none","completed","inprogress","onhold","overdue","risky"];

const STATUS_STYLE = {
  none:       { bg:"transparent",              border:"rgba(60,80,140,0.18)",  text:"rgba(100,120,190,0.35)", glow:"none",                         label:"—"          },
  completed:  { bg:"rgba(0,200,100,0.08)",     border:"rgba(0,210,100,0.70)",  text:"#00cc77",                glow:"0 0 6px rgba(0,200,100,0.35)", label:"Completed"  },
  inprogress: { bg:"rgba(255,210,0,0.07)",     border:"rgba(255,210,0,0.75)",  text:"#ffd600",                glow:"0 0 6px rgba(255,210,0,0.35)", label:"In Progress"},
  onhold:     { bg:"rgba(255,135,0,0.07)",     border:"rgba(255,135,0,0.70)",  text:"#ff9020",                glow:"0 0 6px rgba(255,135,0,0.30)", label:"On Hold"    },
  overdue:    { bg:"rgba(210,82,0,0.08)",      border:"rgba(210,82,0,0.72)",   text:"#d05200",                glow:"0 0 6px rgba(210,82,0,0.32)",  label:"Overdue"    },
  risky:      { bg:"rgba(215,45,45,0.08)",     border:"rgba(215,55,55,0.72)",  text:"#dd3535",                glow:"0 0 6px rgba(215,45,45,0.35)", label:"Risky"      },
};

const FONT = "'Sora','Inter',system-ui,sans-serif";
const MONO = "'JetBrains Mono','Fira Code',monospace";
const CW = 56;
const GAP = 30;

function makeStages(ov={}) { return {...Object.fromEntries(STAGES.map(s=>[s.key,"none"])),...ov}; }

const TAG_COLORS = {
  "Fire Door":   {bg:"rgba(239,68,68,0.12)",  border:"rgba(239,68,68,0.35)",  text:"#fca5a5"},
  "Glazed Door": {bg:"rgba(56,189,248,0.12)", border:"rgba(56,189,248,0.35)", text:"#7dd3fc"},
  "Shutter":     {bg:"rgba(168,85,247,0.12)", border:"rgba(168,85,247,0.35)", text:"#c4b5fd"},
  "Fire Curtain":{bg:"rgba(249,115,22,0.12)", border:"rgba(249,115,22,0.35)", text:"#fdba74"},
};

// ~30% through 23 stages = ~7 stages done. Mixed risky/onhold across projects.
const PROJECTS = [
  // ~30% done (7/23), risky mid-pipeline
  { id:"OPP-2401", name:"Office Renovation – Level 3",    client:"ADNOC",      consultant:"Aecom",          contractor:"Al Fara'a",     value:"287,500", sales:"Sarah M.",    tags:["Fire Door","Glazed Door"],
    stageStatus:makeStages({A:"completed",B:"completed",C:"completed",D:"completed",E:"completed",F:"completed",G:"inprogress",H:"onhold",I:"risky",J:"onhold"}), docs:{} },
  // ~26% done (6/23), heavily on-hold
  { id:"OPP-2402", name:"HVAC Upgrade – Block B",         client:"Mubadala",   consultant:"WSP",            contractor:"Voltas",        value:"142,000", sales:"Mohammed R.", tags:["Shutter"],
    stageStatus:makeStages({A:"completed",B:"completed",C:"completed",D:"completed",E:"onhold",F:"onhold",G:"risky",H:"onhold",I:"onhold"}), docs:{} },
  // ~35% done (8/23), overdue blocking
  { id:"OPP-2403", name:"Landscape Redesign – East Wing", client:"DEWA",       consultant:"Atkins",         contractor:"Khansaheb",     value:"95,300",  sales:"Fatima K.",   tags:["Fire Curtain"],
    stageStatus:makeStages({A:"completed",B:"completed",C:"completed",D:"completed",E:"completed",F:"completed",G:"completed",H:"overdue",I:"risky",J:"onhold",K:"onhold"}), docs:{} },
  // ~74% done (17/23), near end with risky
  { id:"OPP-2404", name:"Data Centre Security Doors",     client:"du Telecom", consultant:"Parsons",        contractor:"Emrill",        value:"410,000", sales:"Ali H.",      tags:["Fire Door","Shutter"],
    stageStatus:makeStages({A:"completed",B:"completed",C:"completed",D:"completed",E:"completed",F:"completed",G:"completed",H:"completed",I:"completed",J:"completed",K:"completed",L:"completed",M:"completed",N:"completed",O:"completed",P:"completed",Q:"inprogress",R:"onhold",S:"risky"}), docs:{} },
  // ~30% done (7/23), stalled
  { id:"OPP-2405", name:"Lobby Glazing Package",          client:"Aldar",      consultant:"RMJM",           contractor:"Depa",          value:"38,750",  sales:"Noura Z.",    tags:["Glazed Door"],
    stageStatus:makeStages({A:"completed",B:"completed",C:"completed",D:"completed",E:"completed",F:"inprogress",G:"onhold",H:"risky",I:"onhold"}), docs:{} },
  // ~87% done (20/23), near completion with one risky
  { id:"OPP-2406", name:"Generator Room Fire Protection", client:"ENOC",       consultant:"Jacobs",         contractor:"Al Naboodah",   value:"215,000", sales:"Khalid M.",   tags:["Fire Curtain","Fire Door"],
    stageStatus:makeStages({A:"completed",B:"completed",C:"completed",D:"completed",E:"completed",F:"completed",G:"completed",H:"completed",I:"completed",J:"completed",K:"completed",L:"completed",M:"completed",N:"completed",O:"completed",P:"completed",Q:"completed",R:"completed",S:"completed",T:"inprogress",U:"risky",V:"onhold"}), docs:{} },
  // ~22% done (5/23), early stage, risky
  { id:"OPP-2407", name:"Parking Area Shutters – Zone C", client:"Emaar",      consultant:"Hyder",          contractor:"Drake & Scull", value:"167,500", sales:"Hessa D.",    tags:["Shutter"],
    stageStatus:makeStages({A:"completed",B:"completed",C:"completed",D:"onhold",E:"risky",F:"onhold",G:"onhold"}), docs:{} },
  // ~30% done (7/23), mixed issues
  { id:"OPP-2408", name:"Smart Building Entry Doors",     client:"TECOM",      consultant:"Buro Happold",   contractor:"Siemens",       value:"330,000", sales:"Omar F.",     tags:["Glazed Door","Fire Door"],
    stageStatus:makeStages({A:"completed",B:"completed",C:"completed",D:"completed",E:"completed",F:"completed",G:"inprogress",H:"onhold",I:"risky",J:"risky",K:"onhold"}), docs:{} },
  // ~39% done (9/23), overdue on samples
  { id:"OPP-2409", name:"Rooftop Plant Room Doors",       client:"DEWA",       consultant:"WSP",            contractor:"Enova",         value:"520,000", sales:"Reem A.",     tags:["Fire Door"],
    stageStatus:makeStages({A:"completed",B:"completed",C:"completed",D:"completed",E:"completed",F:"completed",G:"completed",H:"completed",I:"overdue",J:"risky",K:"onhold",L:"onhold"}), docs:{} },
  // ~61% done (14/23), overdue in production
  { id:"OPP-2410", name:"Chiller Plant Fire Curtains",    client:"ADDC",       consultant:"Mott MacDonald", contractor:"Carrier",       value:"890,000", sales:"Yousef N.",   tags:["Fire Curtain"],
    stageStatus:makeStages({A:"completed",B:"completed",C:"completed",D:"completed",E:"completed",F:"completed",G:"completed",H:"completed",I:"completed",J:"completed",K:"completed",L:"completed",M:"completed",N:"inprogress",O:"overdue",P:"risky",Q:"onhold"}), docs:{} },
  // ~26% done (6/23), risky contracts
  { id:"OPP-2411", name:"Fire Suppression & Curtains",    client:"Nakheel",    consultant:"Aurecon",        contractor:"J. Controls",   value:"175,000", sales:"Sara T.",     tags:["Fire Curtain","Shutter"],
    stageStatus:makeStages({A:"completed",B:"completed",C:"completed",D:"completed",E:"onhold",F:"risky",G:"onhold",H:"onhold"}), docs:{} },
  // ~30% done (7/23), shop drawings overdue
  { id:"OPP-2412", name:"Access Control Glazed Doors",    client:"ABUAD",      consultant:"Khatib",         contractor:"Honeywell",     value:"98,500",  sales:"Maha J.",     tags:["Glazed Door"],
    stageStatus:makeStages({A:"completed",B:"completed",C:"completed",D:"completed",E:"completed",F:"completed",G:"overdue",H:"risky",I:"onhold",J:"onhold"}), docs:{} },
];

function derivePill(ss) {
  const v = STAGES.map(s=>ss[s.key]);
  if (v.every(x=>x==="completed")) return {c:"#00cc77",bg:"rgba(0,180,90,0.09)",bd:"rgba(0,210,100,0.32)",text:"Completed ✓"};
  if (v.includes("risky"))         return {c:"#dd3535",bg:"rgba(215,45,45,0.08)",bd:"rgba(215,55,55,0.28)",text:"Risky"};
  if (v.includes("overdue"))       return {c:"#d05200",bg:"rgba(210,82,0,0.08)", bd:"rgba(210,82,0,0.28)", text:"Overdue"};
  if (v.includes("inprogress"))    return {c:"#ffd600",bg:"rgba(255,210,0,0.08)",bd:"rgba(255,210,0,0.28)",text:"In Progress"};
  if (v.includes("onhold"))        return {c:"#ff9020",bg:"rgba(255,135,0,0.08)",bd:"rgba(255,135,0,0.28)",text:"On Hold"};
  return {c:"rgba(100,120,190,0.42)",bg:"rgba(50,65,110,0.06)",bd:"rgba(70,90,150,0.12)",text:"Not Started"};
}
function fmtVal(v) {
  const n=parseFloat(String(v).replace(/,/g,""))||0;
  if(n>=1e6)return`${(n/1e6).toFixed(1)}M`;
  if(n>=1e3)return`${Math.round(n/1000)}K`;
  return String(v);
}
function exportToExcel(projects) {
  const e=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const rows=projects.map(p=>`<Row><Cell><Data ss:Type="String">${e(p.id)}</Data></Cell><Cell><Data ss:Type="String">${e(p.name)}</Data></Cell><Cell><Data ss:Type="String">${e(p.client)}</Data></Cell><Cell><Data ss:Type="String">${e(p.value)}</Data></Cell><Cell><Data ss:Type="String">${e(p.tags.join(", "))}</Data></Cell></Row>`).join("");
  const xml=`<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Projects"><Table><Row><Cell><Data ss:Type="String">OPP ID</Data></Cell><Cell><Data ss:Type="String">Project</Data></Cell><Cell><Data ss:Type="String">Client</Data></Cell><Cell><Data ss:Type="String">Value</Data></Cell><Cell><Data ss:Type="String">Tags</Data></Cell></Row>${rows}</Table></Worksheet></Workbook>`;
  const url=URL.createObjectURL(new Blob([xml],{type:"application/vnd.ms-excel;charset=utf-8"}));
  const a=Object.assign(document.createElement("a"),{href:url,download:"AI_APEX.xls"});
  document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
}

// ── HEATMAP ───────────────────────────────────────────────────────────────────
function Heatmap() {
  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const times=["8 am","9 am","10 am","11 am","12 pm","1 pm","2 pm"];
  const data=[[20,40,80,120,60,30,10],[30,60,100,200,140,80,20],[40,80,180,400,300,120,30],
    [50,100,220,600,500,200,40],[30,80,160,350,280,160,30],[20,60,120,250,180,100,20],[10,30,80,150,100,60,10]];
  const gc=v=>{const t=v/600;if(t<0.1)return"rgba(38,22,16,0.5)";if(t<0.25)return"rgba(155,52,28,0.65)";if(t<0.45)return"rgba(180,72,32,0.80)";if(t<0.65)return"rgba(205,98,32,0.90)";if(t<0.82)return"rgba(225,128,38,0.96)";return"rgba(242,158,48,1)";};
  return (
    <div style={{width:"100%",height:"100%",fontFamily:FONT,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
      <div style={{display:"flex",gap:3,marginBottom:3,paddingLeft:38}}>
        {days.map(d=><div key={d} style={{flex:1,textAlign:"center",fontSize:8.5,color:"rgba(255,255,255,0.36)",fontWeight:600}}>{d}</div>)}
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between",gap:3}}>
        {times.map((t,ti)=>(
          <div key={t} style={{display:"flex",gap:3,alignItems:"stretch",flex:1}}>
            <div style={{width:36,fontSize:8.5,color:"rgba(255,255,255,0.30)",flexShrink:0,display:"flex",alignItems:"center"}}>{t}</div>
            {days.map((_,di)=>(
              <div key={di} style={{flex:1,minHeight:16,borderRadius:3,background:gc(data[ti][di]),cursor:"pointer"}}
                title={`${t} ${days[di]}: ${data[ti][di]} orders`}
                onMouseEnter={e=>e.currentTarget.style.opacity="0.60"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}/>
            ))}
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:7,marginTop:6,paddingLeft:38}}>
        {[["200+","rgba(155,52,28,0.65)"],["400+","rgba(180,72,32,0.80)"],["600+","rgba(205,98,32,0.90)"],["800+","rgba(225,128,38,0.96)"],["1000+","rgba(242,158,48,1)"]].map(([l,c])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:2}}>
            <div style={{width:8,height:8,borderRadius:2,background:c}}/>
            <span style={{fontSize:7.5,color:"rgba(255,255,255,0.26)"}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LINE CHART ─────────────────────────────────────────────────────────────────
function LineChart() {
  const ref=useRef(null);
  const containerRef=useRef(null);
  const sales=[2800,3200,2600,3800,4200,3900,4790];
  const target=[3000,3000,3200,3200,3500,3600,3630];
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul"];

  const draw = useCallback(() => {
    const c=ref.current;
    const container=containerRef.current;
    if(!c||!container)return;
    const dpr=window.devicePixelRatio||1;
    const W0=container.offsetWidth;
    const H0=container.offsetHeight;
    if(W0<=0||H0<=0)return;
    c.width=W0*dpr; c.height=H0*dpr;
    c.style.width=W0+"px";
    c.style.height=H0+"px";
    const ctx=c.getContext("2d"); ctx.scale(dpr,dpr);
    const w=W0,h=H0,pad={t:14,r:18,b:26,l:42};
    const cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;
    const all=[...sales,...target];
    const minV=Math.min(...all)*0.88,maxV=Math.max(...all)*1.05;
    const xOf=i=>pad.l+(i/(months.length-1))*cw;
    const yOf=v=>pad.t+ch-((v-minV)/(maxV-minV))*ch;
    ctx.clearRect(0,0,w,h);
    for(let g=0;g<=4;g++){
      const y=pad.t+(g/4)*ch;
      ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cw,y);
      ctx.strokeStyle="rgba(255,255,255,0.05)";ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle="rgba(255,255,255,0.26)";ctx.font=`9px ${FONT}`;ctx.textAlign="right";
      ctx.fillText(Math.round(maxV-g*(maxV-minV)/4).toLocaleString(),pad.l-5,y+3);
    }
    months.forEach((m,i)=>{ctx.fillStyle="rgba(255,255,255,0.28)";ctx.font=`9px ${FONT}`;ctx.textAlign="center";ctx.fillText(m,xOf(i),h-4);});
    // sales area
    ctx.beginPath();ctx.moveTo(xOf(0),yOf(sales[0]));sales.forEach((v,i)=>ctx.lineTo(xOf(i),yOf(v)));
    ctx.lineTo(xOf(sales.length-1),pad.t+ch);ctx.lineTo(xOf(0),pad.t+ch);ctx.closePath();
    const g1=ctx.createLinearGradient(0,pad.t,0,pad.t+ch);
    g1.addColorStop(0,"rgba(0,191,255,0.20)");g1.addColorStop(1,"rgba(0,191,255,0.00)");
    ctx.fillStyle=g1;ctx.fill();
    ctx.beginPath();ctx.moveTo(xOf(0),yOf(sales[0]));sales.forEach((v,i)=>ctx.lineTo(xOf(i),yOf(v)));
    ctx.strokeStyle="#00bfff";ctx.lineWidth=2;ctx.lineJoin="round";ctx.stroke();
    // target area
    ctx.beginPath();ctx.moveTo(xOf(0),yOf(target[0]));target.forEach((v,i)=>ctx.lineTo(xOf(i),yOf(v)));
    ctx.lineTo(xOf(target.length-1),pad.t+ch);ctx.lineTo(xOf(0),pad.t+ch);ctx.closePath();
    const g2=ctx.createLinearGradient(0,pad.t,0,pad.t+ch);
    g2.addColorStop(0,"rgba(255,80,80,0.10)");g2.addColorStop(1,"rgba(255,80,80,0.00)");
    ctx.fillStyle=g2;ctx.fill();
    ctx.beginPath();ctx.moveTo(xOf(0),yOf(target[0]));target.forEach((v,i)=>ctx.lineTo(xOf(i),yOf(v)));
    ctx.strokeStyle="rgba(255,88,88,0.85)";ctx.lineWidth=1.6;ctx.lineJoin="round";ctx.stroke();
    // dot
    const lx=xOf(sales.length-1),ly=yOf(sales[sales.length-1]);
    ctx.beginPath();ctx.arc(lx,ly,5,0,Math.PI*2);ctx.fillStyle="#00bfff";ctx.fill();
    ctx.beginPath();ctx.arc(lx,ly,3,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();
    // tooltip
    const bw=88,bh=40,bx=lx-44,by=ly-52;
    ctx.fillStyle="rgba(12,18,46,0.94)";ctx.beginPath();ctx.roundRect(bx,by,bw,bh,4);ctx.fill();
    ctx.strokeStyle="rgba(0,191,255,0.28)";ctx.lineWidth=0.7;ctx.stroke();
    ctx.fillStyle="rgba(255,255,255,0.36)";ctx.font=`7.5px ${FONT}`;ctx.textAlign="center";ctx.fillText("April 3, 2025",bx+bw/2,by+11);
    ctx.fillStyle="#00bfff";ctx.font=`bold 8.5px ${FONT}`;ctx.fillText("Total sales  4790",bx+bw/2,by+23);
    ctx.fillStyle="rgba(255,88,88,0.85)";ctx.font=`8.5px ${FONT}`;ctx.fillText("Target sales  3630",bx+bw/2,by+35);
  }, []);

  useEffect(()=>{
    draw();
    const ro = new ResizeObserver(()=>draw());
    if(containerRef.current) ro.observe(containerRef.current);
    return ()=>ro.disconnect();
  },[draw]);

  return (
    <div ref={containerRef} style={{width:"100%",height:"100%",position:"relative"}}>
      <canvas ref={ref} style={{position:"absolute",inset:0,display:"block"}}/>
    </div>
  );
}

// ── METRIC CARD ───────────────────────────────────────────────────────────────
function MetricCard({label,value,change,up,sub}) {
  return (
    <div style={{flex:1,background:"rgba(14,19,40,0.88)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"13px 15px",backdropFilter:"blur(14px)",minWidth:0}}>
      <div style={{fontSize:10,color:"rgba(255,255,255,0.40)",fontFamily:FONT,marginBottom:6}}>{label}</div>
      <div style={{display:"flex",alignItems:"flex-end",gap:6,marginBottom:3}}>
        <span style={{fontSize:23,fontWeight:700,color:"#fff",fontFamily:FONT,lineHeight:1}}>{value}</span>
        <span style={{fontSize:10,fontWeight:600,fontFamily:FONT,color:up?"#00cc77":"#ff4466",background:up?"rgba(0,200,100,0.10)":"rgba(255,60,100,0.10)",padding:"1px 5px",borderRadius:3,marginBottom:2}}>{up?"↑":"↓"} {change}</span>
      </div>
      <div style={{fontSize:9,color:"rgba(255,255,255,0.24)",fontFamily:FONT}}>{sub}</div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
const NAV=[{icon:"⊞",label:"Dashboard",active:true},{icon:"◫",label:"Orders"},{icon:"⊡",label:"Products"},{icon:"⊛",label:"Customers"},{icon:"◈",label:"Analysis"},{icon:"⊕",label:"Marketing"}];
function Sidebar({collapsed}) {
  return (
    <div style={{width:collapsed?42:152,flexShrink:0,background:"rgba(5,8,22,0.98)",borderRight:"1px solid rgba(255,255,255,0.07)",display:"flex",flexDirection:"column",transition:"width 0.22s",overflow:"hidden"}}>
      <div style={{height:44,display:"flex",alignItems:"center",padding:collapsed?"0 10px":"0 12px",borderBottom:"1px solid rgba(255,255,255,0.07)",gap:7,flexShrink:0}}>
        <div style={{width:21,height:21,borderRadius:5,background:"linear-gradient(135deg,#e85d30,#c33020)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg viewBox="0 0 16 16" width="11" height="11" fill="white"><path d="M8 2L2 6v8h12V6L8 2zm0 9a2 2 0 110-4 2 2 0 010 4z"/></svg>
        </div>
        {!collapsed&&<span style={{fontFamily:FONT,fontSize:12,fontWeight:700,color:"#fff",whiteSpace:"nowrap"}}>Metric Flow</span>}
      </div>
      <div style={{flex:1,padding:"8px 0",display:"flex",flexDirection:"column",gap:1}}>
        {NAV.map(item=>(
          <div key={item.label} style={{display:"flex",alignItems:"center",padding:collapsed?"7px 10px":"7px 12px",gap:7,cursor:"pointer",background:item.active?"rgba(232,93,48,0.13)":"transparent",borderLeft:item.active?"2px solid #e85d30":"2px solid transparent",transition:"all 0.13s"}}
            onMouseEnter={e=>{if(!item.active)e.currentTarget.style.background="rgba(255,255,255,0.04)";}}
            onMouseLeave={e=>{if(!item.active)e.currentTarget.style.background="transparent";}}>
            <span style={{fontSize:13,color:item.active?"#e85d30":"rgba(255,255,255,0.36)",flexShrink:0}}>{item.icon}</span>
            {!collapsed&&<span style={{fontSize:11,fontWeight:item.active?700:400,color:item.active?"#e85d30":"rgba(255,255,255,0.48)",whiteSpace:"nowrap",fontFamily:FONT}}>{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAG BADGE ─────────────────────────────────────────────────────────────────
function TagBadge({tag}) {
  const tc=TAG_COLORS[tag]||{bg:"rgba(100,120,200,0.1)",border:"rgba(100,120,200,0.25)",text:"rgba(150,180,255,0.7)"};
  return <span style={{fontSize:7.5,color:tc.text,background:tc.bg,border:`1px solid ${tc.border}`,padding:"1px 5px",borderRadius:3,fontFamily:FONT,fontWeight:600,whiteSpace:"nowrap"}}>{tag}</span>;
}

// ── PIPELINE RECTANGLE CELL (inline editable) ────────────────────────────────
function PipeCell({stageKey, stageLabel, status, onStatusChange, interactive=false}) {
  const [showPicker, setShowPicker] = useState(false);
  const cellRef = useRef(null);

  useEffect(()=>{
    if(!showPicker) return;
    const handler = (e)=>{ if(cellRef.current && !cellRef.current.contains(e.target)) setShowPicker(false); };
    document.addEventListener("mousedown", handler);
    return ()=>document.removeEventListener("mousedown", handler);
  },[showPicker]);

  const st=STATUS_STYLE[status]||STATUS_STYLE.none;
  const isNone=status==="none";

  const GRAD = {
    none:       "linear-gradient(145deg,rgba(40,50,90,0.28) 0%,rgba(15,20,45,0.18) 100%)",
    completed:  "linear-gradient(145deg,rgba(0,255,140,0.32) 0%,rgba(0,180,90,0.08) 60%,rgba(0,100,50,0.18) 100%)",
    inprogress: "linear-gradient(145deg,rgba(255,230,0,0.36) 0%,rgba(220,180,0,0.08) 60%,rgba(160,120,0,0.20) 100%)",
    onhold:     "linear-gradient(145deg,rgba(255,160,0,0.36) 0%,rgba(220,120,0,0.08) 60%,rgba(160,80,0,0.20) 100%)",
    overdue:    "linear-gradient(145deg,rgba(255,110,0,0.38) 0%,rgba(200,80,0,0.08) 60%,rgba(140,50,0,0.22) 100%)",
    risky:      "linear-gradient(145deg,rgba(255,60,60,0.38) 0%,rgba(200,30,30,0.08) 60%,rgba(140,20,20,0.22) 100%)",
  };
  const SPEC = {
    none:"rgba(140,160,255,0.18)",completed:"rgba(160,255,200,0.55)",inprogress:"rgba(255,245,140,0.55)",
    onhold:"rgba(255,200,100,0.55)",overdue:"rgba(255,150,80,0.55)",risky:"rgba(255,130,130,0.55)",
  };
  const SHADOW_TINT = {
    none:"rgba(10,15,40,0.40)",completed:"rgba(0,80,40,0.50)",inprogress:"rgba(100,80,0,0.50)",
    onhold:"rgba(120,60,0,0.50)",overdue:"rgba(120,40,0,0.50)",risky:"rgba(120,10,10,0.50)",
  };
  const glowColor = status==="risky"?"rgba(255,50,50,0.80)":"rgba(220,90,0,0.80)";
  const isGlow = status==="risky"||status==="overdue";

  const RiskyBall = ()=>(
    <svg width="32" height="32" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`ballBase-${stageKey}`} cx="38%" cy="32%" r="60%">
          <stop offset="0%" stopColor="rgba(255,140,140,0.95)"/>
          <stop offset="40%" stopColor="rgba(220,50,50,0.90)"/>
          <stop offset="100%" stopColor="rgba(100,10,10,0.95)"/>
        </radialGradient>
        <radialGradient id={`ballSpec-${stageKey}`} cx="30%" cy="22%" r="40%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <radialGradient id={`ballRim-${stageKey}`} cx="70%" cy="80%" r="50%">
          <stop offset="0%" stopColor="rgba(255,80,80,0.45)"/>
          <stop offset="100%" stopColor="rgba(255,80,80,0)"/>
        </radialGradient>
      </defs>
      <circle cx="9" cy="9" r="8" fill={`url(#ballBase-${stageKey})`}/>
      <circle cx="9" cy="9" r="8" fill={`url(#ballRim-${stageKey})`}/>
      <ellipse cx="6.5" cy="5.5" rx="3.5" ry="2.2" fill={`url(#ballSpec-${stageKey})`}/>
    </svg>
  );

  const ICONS = {
    completed:  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(200,255,230,0.95)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    inprogress: <svg width="9" height="9" viewBox="0 0 24 24"><polygon points="5,3 20,12 5,21" fill="rgba(255,248,180,0.95)"/></svg>,
    onhold:     <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,160,0.95)" strokeWidth="2.8" strokeLinecap="round"><line x1="6" y1="4" x2="6" y2="20"/><polygon points="10,8 20,12 10,16" fill="rgba(255,220,160,0.95)" stroke="none"/></svg>,
    overdue:    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,185,120,0.95)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    risky:      <RiskyBall/>,
  };

  const PICKER_OPTIONS = [
    {v:"none",      label:"Clear",       dot:"rgba(100,120,190,0.35)"},
    {v:"completed", label:"Completed",   dot:"#00cc77"},
    {v:"inprogress",label:"In Progress", dot:"#ffd600"},
    {v:"onhold",    label:"On Hold",     dot:"#ff9020"},
    {v:"overdue",   label:"Overdue",     dot:"#d05200"},
    {v:"risky",     label:"Risky",       dot:"#dd3535"},
  ];

  const handleClick = (e) => {
    e.stopPropagation();
    if(interactive) setShowPicker(p=>!p);
  };

  return (
    <div ref={cellRef} style={{position:"relative",zIndex:showPicker?100:1}}>
      <div
        onClick={handleClick}
        title={interactive ? `Click to change: ${stageLabel} (${st.label})` : `${stageLabel}: ${st.label}`}
        style={{
          width:29, height:29, flexShrink:0,
          borderRadius: status==="risky" ? "50%" : 6,
          background: status==="risky" ? "transparent" : GRAD[status]||GRAD.none,
          border: status==="risky" ? "none" : `1px solid ${isNone?"rgba(80,100,180,0.14)":st.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor: interactive ? "pointer" : "default",
          transition:"transform 0.14s, box-shadow 0.14s",
          position:"relative", overflow: status==="risky" ? "visible" : "hidden",
          boxShadow: showPicker
            ? `0 0 0 2px rgba(0,191,255,0.80), 2px 3px 10px rgba(0,0,0,0.50)`
            : isNone
              ? "2px 3px 8px rgba(0,0,0,0.40), inset 0 1px 0 rgba(140,160,255,0.10)"
              : status==="risky"
                ? "none"
                : status==="overdue"
                  ? `2px 3px 10px rgba(0,0,0,0.50), 0 0 10px ${glowColor}, 0 0 22px ${glowColor}55, inset 0 1px 0 ${SPEC[status]}`
                  : `2px 3px 10px rgba(0,0,0,0.50), inset 0 1px 0 ${SPEC[status]}, inset 1px 0 0 ${SPEC[status]}44`,
          animation: status==="overdue" ? "cellPulse 1.6s ease-in-out infinite" : "none",
        }}
        onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.22) translateY(-1px)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";}}>

        {status === "risky" && <>
          <div style={{position:"absolute",inset:-5,borderRadius:"50%",border:"1.5px solid rgba(255,60,60,0.55)",animation:"riskyRing 1.8s ease-out infinite",pointerEvents:"none"}}/>
          <div style={{position:"absolute",inset:-9,borderRadius:"50%",border:"1px solid rgba(255,60,60,0.25)",animation:"riskyRing 1.8s ease-out infinite",animationDelay:"0.4s",pointerEvents:"none"}}/>
        </>}

        {status !== "risky" && <>
          <div style={{position:"absolute",bottom:0,right:0,width:"55%",height:"55%",background:`radial-gradient(circle at 80% 80%, ${SHADOW_TINT[status]||SHADOW_TINT.none}, transparent)`,pointerEvents:"none",borderRadius:"0 0 6px 0"}}/>
          <div style={{position:"absolute",top:0,left:0,right:0,height:"45%",background:`linear-gradient(160deg,${SPEC[status]||SPEC.none} 0%,transparent 100%)`,borderRadius:"6px 6px 50% 50%",pointerEvents:"none"}}/>
          {!isNone&&<div style={{position:"absolute",inset:0,borderRadius:6,boxShadow:`inset 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.28)`,pointerEvents:"none"}}/>}
        </>}

        {!isNone && ICONS[status] && (
          <div style={{position:"relative",zIndex:2,display:"flex",alignItems:"center",justifyContent:"center",
            filter: status==="risky"
              ? `drop-shadow(0 0 8px rgba(255,50,50,1.0)) drop-shadow(0 0 18px rgba(255,50,50,0.70)) drop-shadow(0 2px 4px rgba(0,0,0,0.80))`
              : status==="overdue"
                ? `drop-shadow(0 0 5px ${glowColor}) drop-shadow(0 1px 2px rgba(0,0,0,0.60))`
                : "drop-shadow(0 1px 2px rgba(0,0,0,0.50))"}}>
            {ICONS[status]}
          </div>
        )}


      </div>

      {/* Inline status picker popover */}
      {showPicker && interactive && (
        <div style={{
          position:"absolute",top:"calc(100% + 6px)",left:"50%",transform:"translateX(-50%)",
          zIndex:999,background:"rgba(4,8,28,0.97)",border:"1px solid rgba(0,191,255,0.35)",
          borderRadius:8,padding:"6px 5px",boxShadow:"0 8px 32px rgba(0,0,0,0.70), 0 0 12px rgba(0,191,255,0.15)",
          backdropFilter:"blur(12px)",minWidth:118,
        }}>
          {/* Arrow */}
          <div style={{position:"absolute",top:-5,left:"50%",transform:"translateX(-50%)",width:8,height:8,
            background:"rgba(4,8,28,0.97)",border:"1px solid rgba(0,191,255,0.35)",
            borderBottom:"none",borderRight:"none",transform:"translateX(-50%) rotate(45deg)"}}/>
          <div style={{fontSize:7.5,fontFamily:MONO,fontWeight:700,color:"rgba(0,191,255,0.50)",
            letterSpacing:"0.10em",textTransform:"uppercase",marginBottom:4,paddingLeft:5}}>{stageLabel}</div>
          {PICKER_OPTIONS.map(opt=>{
            const isCur = status===opt.v;
            return (
              <div key={opt.v}
                onClick={(e)=>{e.stopPropagation();onStatusChange(opt.v);setShowPicker(false);}}
                style={{
                  display:"flex",alignItems:"center",gap:6,padding:"4px 6px",borderRadius:5,cursor:"pointer",
                  background:isCur?"rgba(0,191,255,0.12)":"transparent",
                  border:isCur?"1px solid rgba(0,191,255,0.28)":"1px solid transparent",
                  transition:"all 0.10s",marginBottom:1,
                }}
                onMouseEnter={e=>{if(!isCur)e.currentTarget.style.background="rgba(255,255,255,0.06)";}}
                onMouseLeave={e=>{if(!isCur)e.currentTarget.style.background="transparent";}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:opt.dot,flexShrink:0,
                  boxShadow:isCur?`0 0 5px ${opt.dot}`:"none"}}/>
                <span style={{fontFamily:FONT,fontSize:10,fontWeight:isCur?700:400,
                  color:isCur?"#fff":"rgba(200,220,255,0.62)",whiteSpace:"nowrap"}}>{opt.label}</span>
                {isCur && <span style={{marginLeft:"auto",fontSize:9,color:"rgba(0,191,255,0.80)"}}>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── PAGINATION ────────────────────────────────────────────────────────────────
function Pagination({total,perPage,page,onPage,onPerPage}) {
  const tp=Math.max(1,Math.ceil(total/perPage));
  const pages=[];
  if(tp<=7){for(let i=1;i<=tp;i++)pages.push(i);}
  else{pages.push(1);if(page>3)pages.push("…");for(let i=Math.max(2,page-1);i<=Math.min(tp-1,page+1);i++)pages.push(i);if(page<tp-2)pages.push("…");pages.push(tp);}
  const btn=a=>({minWidth:25,height:25,borderRadius:5,background:a?"rgba(0,191,255,0.17)":"rgba(255,255,255,0.05)",border:a?"1px solid rgba(0,191,255,0.48)":"1px solid rgba(255,255,255,0.09)",color:a?"#fff":"rgba(255,255,255,0.52)",fontFamily:MONO,fontSize:10,fontWeight:a?700:400,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",outline:"none",cursor:"pointer"});
  return (
    <div style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
      <span style={{fontFamily:MONO,fontSize:9,color:"rgba(255,255,255,0.36)"}}>Show</span>
      <select value={perPage} onChange={e=>{onPerPage(parseInt(e.target.value));onPage(1);}} style={{height:23,borderRadius:4,background:"rgba(0,5,20,0.90)",border:"1px solid rgba(0,191,255,0.28)",color:"#00bfff",fontFamily:MONO,fontSize:9,fontWeight:700,outline:"none",padding:"0 3px"}}>
        {[4,6,8,12].map(n=><option key={n} value={n}>{n}</option>)}
      </select>
      <span style={{fontFamily:MONO,fontSize:8,color:"rgba(255,255,255,0.20)"}}>/pg</span>
      <button onClick={()=>onPage(Math.max(1,page-1))} disabled={page===1} style={{...btn(false),opacity:page===1?0.3:1}}>‹</button>
      {pages.map((p,i)=>p==="…"?<span key={`e${i}`} style={{fontFamily:MONO,fontSize:9,color:"rgba(100,160,255,0.22)",padding:"0 2px"}}>…</span>:<button key={p} onClick={()=>onPage(p)} style={btn(page===p)}>{p}</button>)}
      <button onClick={()=>onPage(Math.min(tp,page+1))} disabled={page===tp} style={{...btn(false),opacity:page===tp?0.3:1}}>›</button>
      <span style={{fontFamily:MONO,fontSize:9,color:"rgba(255,255,255,0.36)",marginLeft:3}}>{total===0?"0":`${Math.min((page-1)*perPage+1,total)}–${Math.min(page*perPage,total)}`}/{total}</span>
    </div>
  );
}

// ── PROJECT MODAL ─────────────────────────────────────────────────────────────
function ProjectModal({project,onClose,onUpdate}) {
  const [activeStage,setActiveStage]=useState(null);
  const [docs,setDocs]=useState(project.docs||{});
  const [stageStatus,setStageStatus]=useState({...project.stageStatus});
  const fileRef=useRef(null);
  const pill=derivePill(stageStatus);
  const GOLD="#d4a030",CYAN="#00bfff";
  const done=STAGES.filter(s=>stageStatus[s.key]==="completed").length;
  const pct=Math.round((done/STAGES.length)*100);
  const handleUpload=(sk,files)=>{
    if(!files||!files.length)return;
    const nd={...docs};if(!nd[sk])nd[sk]=[];
    Array.from(files).forEach(f=>{nd[sk]=[...(nd[sk]||[]),{name:f.name,date:new Date().toLocaleDateString("en-AE")}];});
    setDocs(nd);onUpdate(project.id,stageStatus,nd);
  };
  const rmDoc=(sk,idx)=>{const nd={...docs,[sk]:docs[sk].filter((_,i)=>i!==idx)};setDocs(nd);onUpdate(project.id,stageStatus,nd);};
  return (
    <div style={{position:"fixed",inset:0,zIndex:9000,background:"rgba(0,0,0,0.92)",backdropFilter:"blur(8px)",display:"flex",flexDirection:"column",animation:"modalFadeIn 0.18s ease"}}>
      <div style={{flexShrink:0,height:50,background:"rgba(0,0,0,0.97)",borderBottom:"1px solid rgba(0,160,255,0.18)",display:"flex",alignItems:"center",padding:"0 14px",gap:9}}>
        <button onClick={onClose} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 11px",borderRadius:6,background:"rgba(0,50,110,0.36)",border:"1px solid rgba(0,191,255,0.30)",color:"rgba(0,191,255,0.9)",fontSize:11,fontWeight:700,cursor:"pointer",outline:"none",fontFamily:FONT}}>← Back</button>
        <div style={{width:1,height:20,background:"rgba(0,160,255,0.18)"}}/>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <span style={{fontFamily:MONO,fontSize:11,fontWeight:700,color:GOLD}}>{project.id}</span>
            <span style={{fontFamily:FONT,fontSize:12,fontWeight:700,color:"#fff"}}>{project.name}</span>
            <div style={{display:"flex",gap:3}}>{project.tags.map(t=><TagBadge key={t} tag={t}/>)}</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            {[{l:"Client",v:project.client},{l:"Consultant",v:project.consultant},{l:"Contractor",v:project.contractor},{l:"Value",v:`AED ${project.value}`}].map(k=>(
              <span key={k.l} style={{fontFamily:FONT,fontSize:9,color:"rgba(255,255,255,0.36)"}}><span style={{marginRight:3,color:"rgba(255,255,255,0.22)"}}>{k.l}:</span><span style={{color:"rgba(255,255,255,0.74)",fontWeight:600}}>{k.v}</span></span>
            ))}
          </div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontFamily:MONO,fontSize:9,color:"rgba(255,255,255,0.36)"}}>PROGRESS</span>
            <span style={{fontFamily:FONT,fontSize:13,fontWeight:700,color:pill.c}}>{pct}%</span>
            <div style={{padding:"2px 8px",borderRadius:6,background:pill.bg,border:`1px solid ${pill.bd}`}}><span style={{fontFamily:FONT,fontSize:10,fontWeight:700,color:pill.c}}>{pill.text}</span></div>
          </div>
          <div style={{width:170,height:4,borderRadius:2,background:"rgba(255,255,255,0.07)"}}><div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${CYAN},${pill.c})`,width:`${pct}%`,transition:"width 0.4s"}}/></div>
        </div>
      </div>
      <div style={{flex:1,overflow:"hidden",display:"flex"}}>
        <div style={{flex:"0 0 78%",display:"flex",flexDirection:"column",overflow:"hidden",borderRight:"1px solid rgba(0,160,255,0.09)"}}>
          <div style={{flex:1,overflow:"auto",padding:"11px 13px 0"}}>
            <div style={{fontSize:9,fontFamily:MONO,fontWeight:700,color:"rgba(255,255,255,0.38)",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:7}}>Pipeline Stages</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {STAGES.map(s=>{
                const st=stageStatus[s.key]||"none",ss=STATUS_STYLE[st],isSel=activeStage===s.key,isGray=activeStage!==null&&!isSel,dc=(docs[s.key]||[]).length;
                return (
                  <div key={s.key} onClick={()=>setActiveStage(isSel?null:s.key)}
                    style={{width:96,borderRadius:7,background:isSel?ss.bg:"rgba(0,5,18,0.72)",border:isSel?`1.5px solid ${ss.border}`:`1px solid ${st==="none"?"rgba(60,90,160,0.10)":ss.border+"55"}`,padding:"6px 6px 5px",cursor:"pointer",transition:"all 0.14s",opacity:isGray?0.26:1}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
                      <div style={{width:13,height:13,borderRadius:3,background:st==="none"?"rgba(60,90,160,0.14)":ss.bg,border:`1px solid ${st==="none"?"rgba(60,90,160,0.18)":ss.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontFamily:MONO,fontSize:7,fontWeight:700,color:st==="none"?"rgba(160,190,255,0.42)":ss.text}}>{s.key}</span>
                      </div>
                      {dc>0&&<div style={{width:13,height:13,borderRadius:3,background:"rgba(0,191,255,0.12)",border:"1px solid rgba(0,191,255,0.26)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:MONO,fontSize:7,fontWeight:700,color:"#00bfff"}}>{dc}</span></div>}
                    </div>
                    <div style={{fontFamily:FONT,fontSize:8.5,fontWeight:600,color:isSel?"#fff":st==="none"?"rgba(195,210,255,0.33)":ss.text,lineHeight:1.2,marginBottom:3}}>{s.label}</div>
                    {st!=="none"&&<div style={{display:"inline-flex",alignItems:"center",gap:2,padding:"1px 4px",borderRadius:3,background:ss.bg,border:`1px solid ${ss.border}55`}}>
                      <span style={{width:4,height:4,borderRadius:"50%",background:ss.text,flexShrink:0}}/>
                      <span style={{fontSize:6.5,fontFamily:FONT,fontWeight:700,color:ss.text}}>{ss.label==="In Progress"?"Active":ss.label}</span>
                    </div>}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{flexShrink:0,borderTop:"1px solid rgba(0,160,255,0.09)",padding:"8px 13px",background:"rgba(0,3,14,0.72)",minHeight:activeStage?68:36}}>
            {activeStage?(() => {
              const s=STAGES.find(x=>x.key===activeStage),st=stageStatus[activeStage]||"none";
              return (
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}>
                    <span style={{fontFamily:FONT,fontSize:10,fontWeight:700,color:"#fff"}}>{s?.label}</span>
                    <span style={{fontFamily:MONO,fontSize:8,color:"rgba(255,255,255,0.28)"}}>— set status:</span>
                  </div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {S_CYCLE.filter(v=>v!=="none").map(sv=>{
                      const sg=STATUS_STYLE[sv],sel=st===sv;
                      return <button key={sv} onClick={()=>{const ns={...stageStatus,[activeStage]:sv};setStageStatus(ns);onUpdate(project.id,ns,docs);}}
                        style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:5,cursor:"pointer",outline:"none",fontFamily:FONT,fontSize:9,fontWeight:sel?700:400,background:sel?sg.bg:"rgba(255,255,255,0.04)",border:sel?`1.5px solid ${sg.border}`:"1px solid rgba(255,255,255,0.07)",color:sel?"#fff":"rgba(200,215,255,0.38)",transition:"all 0.11s"}}>
                        <span style={{width:5,height:5,borderRadius:"50%",background:sg.text,flexShrink:0}}/>{sg.label}
                      </button>;
                    })}
                  </div>
                </div>
              );
            })():<span style={{fontFamily:FONT,fontSize:9,color:"rgba(255,255,255,0.20)"}}>Click a stage to set its status</span>}
          </div>
          <div style={{flexShrink:0,borderTop:"1px solid rgba(0,160,255,0.09)",padding:"10px 13px",background:"rgba(0,3,14,0.80)"}}>
            <div style={{fontSize:8,fontFamily:MONO,fontWeight:700,color:"rgba(255,255,255,0.36)",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>Upload {activeStage&&<span style={{color:"rgba(255,214,0,0.62)",marginLeft:4}}>→ {STAGES.find(s=>s.key===activeStage)?.label}</span>}</div>
            <div style={{borderRadius:10,border:`2px dashed ${activeStage?"rgba(0,191,255,0.50)":"rgba(255,255,255,0.10)"}`,background:activeStage?"rgba(0,20,60,0.40)":"rgba(255,255,255,0.02)",height:"30vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,cursor:"pointer",transition:"all 0.18s"}}
              onClick={()=>activeStage&&fileRef.current?.click()}
              onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="rgba(0,191,255,0.80)";e.currentTarget.style.background="rgba(0,40,100,0.45)";}}
              onDragLeave={e=>{e.currentTarget.style.borderColor=activeStage?"rgba(0,191,255,0.50)":"rgba(255,255,255,0.10)";e.currentTarget.style.background=activeStage?"rgba(0,20,60,0.40)":"rgba(255,255,255,0.02)";}}
              onDrop={e=>{e.preventDefault();e.currentTarget.style.borderColor=activeStage?"rgba(0,191,255,0.50)":"rgba(255,255,255,0.10)";if(activeStage)handleUpload(activeStage,e.dataTransfer.files);}}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={activeStage?"rgba(0,191,255,0.70)":"rgba(255,255,255,0.22)"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:FONT,fontSize:13,fontWeight:600,color:activeStage?"rgba(255,255,255,0.80)":"rgba(255,255,255,0.25)",marginBottom:4}}>{activeStage?`Drop files for ${STAGES.find(s=>s.key===activeStage)?.label}`:"Select a stage first to upload"}</div>
                <div style={{fontFamily:FONT,fontSize:10,color:"rgba(255,255,255,0.25)"}}>PDF · DOCX · JPG · PNG · XLSX</div>
              </div>
              {activeStage&&<div style={{padding:"6px 18px",borderRadius:6,background:"rgba(0,191,255,0.14)",border:"1px solid rgba(0,191,255,0.40)",fontFamily:FONT,fontSize:11,fontWeight:600,color:"#00bfff"}}>Browse Files</div>}
              <input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls" style={{display:"none"}} onChange={e=>{if(activeStage){handleUpload(activeStage,e.target.files);}e.target.value="";}}/>
            </div>
          </div>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"rgba(0,2,10,0.42)"}}>
          <div style={{flexShrink:0,padding:"9px 11px 7px",borderBottom:"1px solid rgba(0,160,255,0.07)"}}>
            <span style={{fontFamily:MONO,fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.38)",letterSpacing:"0.12em",textTransform:"uppercase"}}>Documents</span>
            <span style={{fontFamily:MONO,fontSize:8,color:"rgba(255,255,255,0.20)",marginLeft:6}}>{Object.values(docs).reduce((a,v)=>a+(v||[]).length,0)} file(s)</span>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"6px 11px",display:"flex",flexDirection:"column",gap:4}}>
            {STAGES.map(s=>{
              const fl=docs[s.key]||[];if(!fl.length)return null;
              const ss=STATUS_STYLE[stageStatus[s.key]||"none"],isSel=activeStage===s.key;
              return <div key={s.key} style={{borderRadius:6,background:isSel?"rgba(0,18,58,0.60)":"rgba(0,9,28,0.40)",border:`1px solid ${isSel?"rgba(0,191,255,0.20)":"rgba(0,160,255,0.06)"}`,padding:"6px 8px"}}>
                <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4}}>
                  <span style={{fontFamily:FONT,fontSize:9,fontWeight:700,color:ss.text}}>{s.label}</span>
                  <span style={{fontFamily:MONO,fontSize:7,color:"rgba(255,255,255,0.20)",marginLeft:"auto"}}>{fl.length} file{fl.length!==1?"s":""}</span>
                </div>
                {fl.map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 5px",borderRadius:4,background:"rgba(0,28,76,0.36)",border:"1px solid rgba(0,160,255,0.06)",marginBottom:2}}>
                    <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="rgba(0,191,255,0.40)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span style={{fontFamily:FONT,fontSize:9,color:"rgba(255,255,255,0.68)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</span>
                    <span style={{fontFamily:MONO,fontSize:7,color:"rgba(255,255,255,0.20)"}}>{f.date}</span>
                    <button onClick={()=>rmDoc(s.key,i)} style={{width:12,height:12,borderRadius:3,border:"none",cursor:"pointer",background:"rgba(255,45,85,0.12)",color:"rgba(255,100,120,0.70)",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",outline:"none"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,45,85,0.28)"}
                      onMouseLeave={e=>e.currentTarget.style.background="rgba(255,45,85,0.12)"}>×</button>
                  </div>
                ))}
              </div>;
            })}
            {Object.values(docs).every(a=>!a||!a.length)&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,flex:1,opacity:0.22}}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
              <span style={{fontFamily:FONT,fontSize:9,color:"rgba(255,255,255,0.40)"}}>No documents yet</span>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DIRECTOR REVIEW MODAL ─────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
export default function Dashboard({ onBack }) {
  const [projects,setProjects]=useState(PROJECTS);
  const [openProject,setOpenProject]=useState(null);
  const [search,setSearch]=useState("");
  const [filterStage,setFilterStage]=useState(null);
  const [filterTag,setFilterTag]=useState(null);
  const [filterStatus,setFilterStatus]=useState(null);
  const [page,setPage]=useState(1);
  const [perPage,setPerPage]=useState(4);
  const [tick,setTick]=useState(0);
  const [sidebarCollapsed,setSidebarCollapsed]=useState(false);
  const [leftPct,setLeftPct]=useState(37);
  const [topPct,setTopPct]=useState(45);

  const rightBodyRef=useRef(null),rightHdrRef=useRef(null);
  const leftBodyRef=useRef(null),leftHdrRef=useRef(null);
  const splitRef=useRef(null);
  const vSplitRef=useRef(null);
  const syncing=useRef(false);

  const startVDrag=useCallback((e)=>{
    e.preventDefault();
    const container=vSplitRef.current;
    if(!container)return;
    const getY=(ev)=>ev.touches?ev.touches[0].clientY:ev.clientY;
    const onMove=(mv)=>{
      const rect=container.getBoundingClientRect();
      const pct=((getY(mv)-rect.top)/rect.height)*100;
      setTopPct(Math.min(75,Math.max(20,pct)));
    };
    const onUp=()=>{
      window.removeEventListener('mousemove',onMove);
      window.removeEventListener('mouseup',onUp);
      window.removeEventListener('touchmove',onMove);
      window.removeEventListener('touchend',onUp);
    };
    window.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);
    window.addEventListener('touchmove',onMove,{passive:false});
    window.addEventListener('touchend',onUp);
  },[]);

  const startDrag=useCallback((e)=>{
    e.preventDefault();
    const container=splitRef.current;
    if(!container)return;
    const getX=(ev)=>ev.touches?ev.touches[0].clientX:ev.clientX;
    const onMove=(mv)=>{
      const rect=container.getBoundingClientRect();
      const pct=((getX(mv)-rect.left)/rect.width)*100;
      setLeftPct(Math.min(65,Math.max(20,pct)));
    };
    const onUp=()=>{
      window.removeEventListener("mousemove",onMove);
      window.removeEventListener("mouseup",onUp);
      window.removeEventListener("touchmove",onMove);
      window.removeEventListener("touchend",onUp);
    };
    window.addEventListener("mousemove",onMove);
    window.addEventListener("mouseup",onUp);
    window.addEventListener("touchmove",onMove,{passive:false});
    window.addEventListener("touchend",onUp);
  },[]);

  useEffect(()=>{const id=setInterval(()=>setTick(t=>t+1),1000);return()=>clearInterval(id);},[]);

  const now=new Date();
  const timeStr=now.toLocaleTimeString("en-AE",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const dateStr=now.toLocaleDateString("en-AE",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});

  const totalVal=projects.reduce((a,p)=>a+(parseFloat(p.value.replace(/,/g,""))||0),0);
  const allDone=projects.filter(p=>STAGES.every(s=>p.stageStatus[s.key]==="completed")).length;
  const atRisk=projects.filter(p=>Object.values(p.stageStatus).includes("risky")||Object.values(p.stageStatus).includes("overdue")).length;
  const active=projects.filter(p=>Object.values(p.stageStatus).includes("inprogress")).length;

  const updateProject=(pid,newSS,newDocs)=>{
    setProjects(ps=>ps.map(p=>p.id===pid?{...p,stageStatus:newSS,docs:newDocs}:p));
    if(openProject&&openProject.id===pid)setOpenProject(p=>({...p,stageStatus:newSS,docs:newDocs}));
  };

  const allFiltered=projects.filter(p=>{
    const q=search.toLowerCase();
    return(!search||[p.name,p.id,p.client,p.sales,p.consultant,p.contractor].some(v=>v.toLowerCase().includes(q)))
      &&(!filterStage||p.stageStatus[filterStage]!=="none")
      &&(!filterTag||p.tags.includes(filterTag))
      &&(!filterStatus||Object.values(p.stageStatus).includes(filterStatus));
  });
  const filteredTotal=allFiltered.length;
  const tp=Math.max(1,Math.ceil(filteredTotal/perPage));
  const sp=Math.min(page,tp);
  const pageP=allFiltered.slice((sp-1)*perPage,sp*perPage);
  const isFiltered=!!(search||filterStage||filterTag||filterStatus);

  const GOLD="#d4a030",CYAN="#00bfff";
  const PIPE_W=STAGES.length*(CW+GAP),PILL_W=148,HDR_H=48,ROW_H=58;
  const LCOLS=[
    {key:"id",label:"OPP ID",w:92},{key:"name",label:"Project Name",w:192},
    {key:"client",label:"Client",w:92},{key:"cons",label:"Consultant",w:102},
    {key:"cont",label:"Contractor",w:106},{key:"val",label:"Value (AED)",w:106},{key:"sales",label:"Sales Rep",w:90},
  ];
  const LTW=LCOLS.reduce((a,c)=>a+c.w,0)+8;

  const syncL=()=>{if(syncing.current)return;syncing.current=true;if(rightBodyRef.current&&leftBodyRef.current)rightBodyRef.current.scrollTop=leftBodyRef.current.scrollTop;if(leftHdrRef.current&&leftBodyRef.current)leftHdrRef.current.scrollLeft=leftBodyRef.current.scrollLeft;setTimeout(()=>{syncing.current=false;},0);};
  const syncR=()=>{if(syncing.current)return;syncing.current=true;if(leftBodyRef.current&&rightBodyRef.current)leftBodyRef.current.scrollTop=rightBodyRef.current.scrollTop;if(rightHdrRef.current&&rightBodyRef.current)rightHdrRef.current.scrollLeft=rightBodyRef.current.scrollLeft;setTimeout(()=>{syncing.current=false;},0);};

  const fBtn=(active,color=CYAN)=>({
    display:"flex",alignItems:"center",justifyContent:"center",padding:"3px 9px",borderRadius:5,flexShrink:0,outline:"none",cursor:"pointer",
    border:active?`1.5px solid ${color}88`:"1px solid rgba(255,255,255,0.12)",
    background:active?"rgba(0,191,255,0.10)":"rgba(255,255,255,0.04)",
    color:active?"#fff":"rgba(255,255,255,0.52)",
    fontSize:9.5,fontWeight:active?700:400,fontFamily:FONT,whiteSpace:"nowrap",transition:"all 0.11s",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body,#root{font-family:'Sora','Inter',system-ui,sans-serif;background:#060810;overflow:hidden;height:100%;width:100%;}
        @keyframes modalFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes goldShimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        @keyframes pulse{0%,100%{opacity:0.6}50%{opacity:1}}
        @keyframes borderShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes cellPulse{0%,100%{opacity:1}50%{opacity:0.60}}
        @keyframes riskyRing{0%{transform:scale(1);opacity:0.80}100%{transform:scale(1.8);opacity:0}}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-track{background:rgba(0,10,30,0.3);}
        ::-webkit-scrollbar-thumb{background:rgba(0,191,255,0.18);border-radius:10px;}
        select{cursor:pointer;}
        .hsplit-handle:hover{background:rgba(124,58,237,0.22)!important;}
        .hsplit-handle:active{background:rgba(124,58,237,0.35)!important;cursor:row-resize;}
        @keyframes handlePulse{0%,100%{opacity:0.55}50%{opacity:1.0}}
      `}</style>

      {openProject&&<ProjectModal project={openProject} onClose={()=>setOpenProject(null)} onUpdate={updateProject}/>}

      <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"10px",background:"#000000"}}>
        <div style={{flex:1,height:"100%",width:"100%",display:"flex",flexDirection:"column",background:"#0d1120",overflow:"hidden",borderRadius:11,boxShadow:"0 0 40px rgba(124,58,237,0.25), 0 0 80px rgba(6,182,212,0.15)"}}>

          {/* ── GLOBAL HEADER ──────────────────────────────────────────────── */}
          <div style={{flexShrink:0,height:44,background:"rgba(3,5,16,0.99)",borderBottom:"1px solid rgba(0,160,255,0.17)",display:"flex",alignItems:"center",padding:"0 14px",gap:11,zIndex:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
              <div style={{display:"flex",gap:3}}>{[0,1,2].map(i=><div key={i} style={{width:4,height:4,borderRadius:"50%",background:"rgba(212,160,48,0.85)",boxShadow:"0 0 4px rgba(212,160,48,0.80)",animation:"blink 2.5s ease-in-out infinite",animationDelay:`${i*0.35}s`}}/>)}</div>
              <span style={{fontFamily:"'Sora',system-ui",fontSize:17,fontWeight:800,letterSpacing:"0.07em",background:"linear-gradient(135deg,#8a5800 0%,#d4a030 30%,#fff8d0 52%,#d4a030 72%,#8a5800 100%)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"goldShimmer 4s linear infinite"}}>AI APEX</span>
              <span style={{fontFamily:"'Sora',system-ui",fontSize:10,fontWeight:500,color:"rgba(170,190,255,0.48)",letterSpacing:"0.04em"}}>OVERALL PROJECT DASHBOARD</span>
            </div>
            <div style={{display:"flex",gap:9,alignItems:"center",marginLeft:7}}>
              {[{l:"TOTAL",v:projects.length,c:CYAN},{l:"ACTIVE",v:active,c:"#ffd600"},{l:"COMPLETED",v:allDone,c:"#00cc77"},{l:"AT RISK",v:atRisk,c:"#dd3535"},{l:"PORTFOLIO",v:`AED ${fmtVal(totalVal)}`,c:GOLD}].map(k=>(
                <div key={k.l} style={{display:"flex",alignItems:"center",gap:3}}>
                  <span style={{width:5,height:5,borderRadius:"50%",background:k.c,boxShadow:`0 0 4px ${k.c}`,flexShrink:0}}/>
                  <span style={{fontFamily:MONO,fontSize:7.5,color:"rgba(255,255,255,0.36)",letterSpacing:"0.10em"}}>{k.l}</span>
                  <span style={{fontFamily:FONT,fontSize:11,fontWeight:700,color:k.c}}>{k.v}</span>
                </div>
              ))}
            </div>
            <div style={{marginLeft:"auto",display:"flex",flexDirection:"column",alignItems:"flex-end"}}>
              <div style={{fontFamily:MONO,fontSize:12,fontWeight:700,color:GOLD}}>{timeStr}</div>
              <div style={{fontFamily:MONO,fontSize:8,color:"rgba(255,255,255,0.30)",letterSpacing:"0.07em"}}>{dateStr}
              <button 
                onClick={onBack} 
                style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '5px 12px', borderRadius: '6px', color: '#ffffff', cursor: 'pointer', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s ease' }} 
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(28, 34, 64, 0.6)'; e.currentTarget.style.borderColor = '#fff'; }} 
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}>
                Exit
              </button>
              </div>
            </div>
          </div>

          {/* ── VERTICAL SPLIT CONTAINER ─────────────────────────────────── */}
          <div ref={vSplitRef} style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>

          {/* ── TOP HALF ─────────────────────────────────────────────────────── */}
          <div style={{height:`${topPct}%`,flexShrink:0,display:"flex",borderBottom:"none",overflow:"hidden",minHeight:0}}>
            <Sidebar collapsed={sidebarCollapsed}/>
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"rgba(7,11,26,0.97)",minWidth:0}}>
              {/* Metric Flow bar */}
              <div style={{flexShrink:0,height:42,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 13px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <button onClick={()=>setSidebarCollapsed(c=>!c)} style={{width:25,height:25,borderRadius:5,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",cursor:"pointer",outline:"none",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.52)",fontSize:12,flexShrink:0}}>≡</button>
                  <div style={{position:"relative",width:180}}>
                    <svg style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)"}} viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input placeholder="Search" style={{width:"100%",padding:"5px 9px 5px 24px",borderRadius:5,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.74)",fontSize:10,outline:"none",fontFamily:FONT}}/>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{fontFamily:FONT,fontSize:10,color:"rgba(255,255,255,0.42)",background:"rgba(255,255,255,0.05)",padding:"3px 10px",borderRadius:5,border:"1px solid rgba(255,255,255,0.08)"}}>{dateStr}</div>
                  <div style={{width:27,height:27,borderRadius:"50%",background:"linear-gradient(135deg,#e85d30,#ff8c60)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",fontFamily:FONT}}>A</div>
                </div>
              </div>

              {/* Metric cards */}
              <div style={{flexShrink:0,display:"flex",gap:8,padding:"8px 13px 6px"}}>
                <MetricCard label="Total Revenue"   value="$ 24,500" change="12.9%" up={true}  sub="From Jun 01,2024 To Jun 28,2024"/>
                <MetricCard label="Total Order"     value="1,240"    change="6.2%"  up={true}  sub="From Jun 05,2024 To Jun 29,2024"/>
                <MetricCard label="New customer"    value="320"      change="6.5%"  up={false} sub="From Jun 21,2024 To Jun 28,2024"/>
                <MetricCard label="Conversion rate" value="3.2 %"   change="2.1%"  up={true}  sub="From Jun 01,2024 To Jun 28,2024"/>
              </div>

              {/* Charts row — KEY FIX: flex:1 + minHeight:0 ensures both panels
                  fill remaining space equally, canvas resizes via ResizeObserver */}
              <div style={{
                flex:1,
                minHeight:0,
                display:"flex",
                gap:8,
                padding:"0 13px 8px",
                overflow:"hidden",
              }}>
                {/* Heatmap panel */}
                <div style={{
                  flex:"0 0 37%",
                  minWidth:0,
                  background:"rgba(11,15,34,0.90)",
                  border:"1px solid rgba(255,255,255,0.06)",
                  borderRadius:9,
                  padding:"9px 11px",
                  display:"flex",
                  flexDirection:"column",
                  overflow:"hidden",
                }}>
                  <div style={{fontFamily:FONT,fontSize:11,fontWeight:700,color:"#fff",marginBottom:7,flexShrink:0}}>Orders by time</div>
                  <div style={{flex:1,minHeight:0,overflow:"hidden"}}>
                    <Heatmap/>
                  </div>
                </div>

                {/* Line chart panel */}
                <div style={{
                  flex:1,
                  minWidth:0,
                  background:"rgba(11,15,34,0.90)",
                  border:"1px solid rgba(255,255,255,0.06)",
                  borderRadius:9,
                  padding:"9px 11px",
                  display:"flex",
                  flexDirection:"column",
                  overflow:"hidden",
                }}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7,flexShrink:0}}>
                    <span style={{fontFamily:FONT,fontSize:11,fontWeight:700,color:"#fff"}}>Monthly Sales performance</span>
                    <div style={{display:"flex",gap:10}}>
                      {[{l:"Sales",c:"#00bfff"},{l:"Target",c:"rgba(255,88,88,0.85)"}].map(x=>(
                        <div key={x.l} style={{display:"flex",alignItems:"center",gap:4}}>
                          <div style={{width:18,height:2,borderRadius:1,background:x.c}}/>
                          <span style={{fontSize:9,color:"rgba(255,255,255,0.42)",fontFamily:FONT}}>{x.l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* This container fills all remaining height; LineChart measures it via ResizeObserver */}
                  <div style={{flex:1,minHeight:0,position:"relative"}}>
                    <LineChart/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── HORIZONTAL DRAG HANDLE ───────────────────────────────────────── */}
          <div
            className="hsplit-handle"
            onMouseDown={startVDrag}
            onTouchStart={startVDrag}
            title="Drag to resize panels"
            style={{
              flexShrink:0,height:16,cursor:"row-resize",touchAction:"none",display:"flex",
              alignItems:"center",justifyContent:"center",
              background:"rgba(0,0,0,0.70)",userSelect:"none",zIndex:50,
              borderTop:"1px solid rgba(124,58,237,0.40)",
              borderBottom:"1px solid rgba(6,182,212,0.40)",
              transition:"background 0.15s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(124,58,237,0.25)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0.70)"}>
            <div style={{display:"flex",alignItems:"center",gap:8,pointerEvents:"none"}}>
              <div style={{width:44,height:1.5,borderRadius:1,background:"linear-gradient(90deg,transparent,rgba(124,58,237,0.70),rgba(6,182,212,0.70),transparent)"}}/>
              <div style={{display:"flex",gap:3,alignItems:"center"}}>
                {[0,1,2,3,4,5,6].map(i=><div key={i} style={{width:i===3?5:3,height:i===3?5:3,borderRadius:"50%",background:i===3?"rgba(6,182,212,1.0)":i===2||i===4?"rgba(124,58,237,0.80)":"rgba(124,58,237,0.40)",boxShadow:i===3?"0 0 5px rgba(6,182,212,0.80)":"none"}}/>)}
              </div>
              <div style={{width:44,height:1.5,borderRadius:1,background:"linear-gradient(90deg,rgba(6,182,212,0.70),rgba(124,58,237,0.70),transparent)"}}/>
              <span style={{fontFamily:"'Sora',system-ui",fontSize:7,fontWeight:700,color:"rgba(124,58,237,0.70)",letterSpacing:"0.12em",textTransform:"uppercase"}}>DRAG TO RESIZE</span>
            </div>
          </div>

          {/* ── BOTTOM HALF ──────────────────────────────────────────────────── */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0,background:"rgba(3,5,15,0.98)"}}>

            {/* Filter bar */}
            <div style={{flexShrink:0,background:"rgba(3,5,16,0.99)",borderBottom:"1px solid rgba(0,160,255,0.11)"}}>
              <div style={{height:34,display:"flex",alignItems:"center",padding:"0 11px",gap:4,borderBottom:"1px solid rgba(0,160,255,0.07)",overflowX:"auto",overflowY:"hidden"}}>
                <span style={{fontFamily:MONO,fontSize:8.5,color:"rgba(255,255,255,0.48)",letterSpacing:"0.12em",flexShrink:0,fontWeight:700,textTransform:"uppercase"}}>STATUS</span>
                {[{l:"All",v:null,c:CYAN},{l:"In Progress",v:"inprogress",c:"#ffd600"},{l:"On Hold",v:"onhold",c:"#ff9020"},{l:"Completed",v:"completed",c:"#00cc77"},{l:"Overdue",v:"overdue",c:"#d05200"},{l:"Risky",v:"risky",c:"#dd3535"}].map(o=>{
                  const a=filterStatus===o.v||(o.v===null&&filterStatus===null);
                  return <button key={o.l} onClick={()=>{setFilterStatus(o.v);setPage(1);}} style={{...fBtn(a,o.c),gap:3}}>
                    <span style={{width:4,height:4,borderRadius:"50%",background:o.c,flexShrink:0}}/>{o.l}
                  </button>;
                })}
                <div style={{width:1,height:10,background:"rgba(0,160,255,0.14)",flexShrink:0,margin:"0 4px"}}/>
                <span style={{fontFamily:MONO,fontSize:8.5,color:"rgba(255,255,255,0.48)",letterSpacing:"0.12em",flexShrink:0,fontWeight:700,textTransform:"uppercase"}}>PRODUCT</span>
                {[{l:"All",v:null},{l:"Fire Door",v:"Fire Door"},{l:"Glazed Door",v:"Glazed Door"},{l:"Shutter",v:"Shutter"},{l:"Fire Curtain",v:"Fire Curtain"}].map(o=>{
                  const a=o.v===null?!filterTag:filterTag===o.v;
                  return <button key={o.l} onClick={()=>{setFilterTag(o.v===null?null:o.v);setPage(1);}} style={fBtn(a,CYAN)}>{o.l}</button>;
                })}
                <span style={{fontSize:8.5,color:"rgba(255,255,255,0.30)",marginLeft:"auto",fontFamily:MONO,flexShrink:0}}>{filteredTotal}/{projects.length} projects</span>
              </div>
              <div style={{height:30,display:"flex",alignItems:"center",padding:"0 11px",gap:4,overflowX:"auto",overflowY:"hidden"}}>
                <span style={{fontFamily:MONO,fontSize:8.5,color:"rgba(255,255,255,0.48)",letterSpacing:"0.12em",flexShrink:0,fontWeight:700,textTransform:"uppercase",marginRight:2}}>STAGE</span>
                <button onClick={()=>{setFilterStage(null);setPage(1);}} style={{...fBtn(!filterStage,CYAN),padding:"2px 6px",fontSize:8.5}}>ALL</button>
                {STAGES.map(s=>{const a=filterStage===s.key;return <button key={s.key} onClick={()=>{setFilterStage(a?null:s.key);setPage(1);}} title={s.label} style={{...fBtn(a,CYAN),padding:"2px 5px",fontSize:8.5}}>{s.label}</button>;})}
                <div style={{marginLeft:"auto",flexShrink:0}}>
                  <button onClick={()=>exportToExcel(projects)} style={{display:"flex",alignItems:"center",gap:4,padding:"2px 9px",borderRadius:4,background:"rgba(0,191,255,0.09)",border:"1px solid rgba(0,191,255,0.32)",outline:"none",color:"#fff",fontSize:8.5,fontWeight:700,fontFamily:FONT,cursor:"pointer",whiteSpace:"nowrap"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(0,191,255,0.19)"}
                    onMouseLeave={e=>e.currentTarget.style.background="rgba(0,191,255,0.09)"}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Export XLS
                  </button>
                </div>
              </div>
            </div>

            {/* Split table */}
            <div ref={splitRef} style={{flex:1,display:"flex",overflow:"hidden",minHeight:0,padding:"0 8px 0 8px"}}>

              {/* LEFT */}
              <div style={{width:`${leftPct}%`,flexShrink:0,display:"flex",flexDirection:"column",overflow:"hidden",borderRadius:8,border:"1px solid rgba(0,160,255,0.12)"}}>
                <div style={{flexShrink:0,height:30,background:"rgba(0,2,12,0.96)",borderBottom:"1px solid rgba(0,160,255,0.11)",display:"flex",alignItems:"center",padding:"0 9px",gap:6}}>
                  <span style={{width:2,height:10,background:`linear-gradient(180deg,${GOLD},rgba(200,140,30,0.26))`,borderRadius:1,flexShrink:0}}/>
                  <span style={{fontFamily:FONT,fontSize:9.5,fontWeight:700,color:"#fff",letterSpacing:"0.06em",textTransform:"uppercase"}}>Project Details</span>
                  <div style={{marginLeft:4,padding:"1px 5px",borderRadius:3,background:isFiltered?"rgba(0,140,255,0.09)":"rgba(255,255,255,0.03)",border:isFiltered?"1px solid rgba(0,191,255,0.26)":"1px solid rgba(255,255,255,0.04)"}}>
                    <span style={{fontFamily:MONO,fontSize:7.5,color:isFiltered?"rgba(255,255,255,0.70)":"rgba(255,255,255,0.28)",fontWeight:700}}>{filteredTotal}{isFiltered?` / ${projects.length}`:""}</span>
                  </div>
                  <span style={{fontSize:7.5,color:"rgba(255,255,255,0.20)",fontFamily:FONT,fontStyle:"italic"}}>click row to open</span>
                </div>
                <div ref={leftHdrRef} style={{flexShrink:0,height:HDR_H,display:"flex",alignItems:"center",background:"rgba(0,2,11,0.92)",borderBottom:"1px solid rgba(0,160,255,0.09)",overflowX:"hidden",overflowY:"hidden"}}>
                  <div style={{display:"flex",alignItems:"center",width:LTW,minWidth:"100%",paddingLeft:7,flexShrink:0}}>
                    {LCOLS.map(c=><div key={c.key} style={{width:c.w,flexShrink:0,padding:"0 4px"}}><span style={{fontSize:9.5,color:"rgba(255,255,255,0.76)",fontFamily:FONT,letterSpacing:"0.03em",textTransform:"uppercase",whiteSpace:"nowrap",fontWeight:700}}>{c.label}</span></div>)}
                  </div>
                </div>
                <div ref={leftBodyRef} onScroll={syncL} style={{flex:1,overflowY:"auto",overflowX:"auto"}}>
                  <div style={{width:LTW,minWidth:"100%",minHeight:"100%"}}>
                    {pageP.map((p,ri)=>(
                      <div key={p.id} style={{height:ROW_H,display:"flex",alignItems:"center",borderBottom:"1px solid rgba(0,70,150,0.06)",background:ri%2===0?"rgba(0,3,16,0.50)":"rgba(0,2,9,0.28)",paddingLeft:7,transition:"background 0.11s",cursor:"pointer"}}
                        onClick={()=>setOpenProject(p)}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(0,46,106,0.34)"}
                        onMouseLeave={e=>e.currentTarget.style.background=ri%2===0?"rgba(0,3,16,0.50)":"rgba(0,2,9,0.28)"}>
                        <div style={{width:LCOLS[0].w,flexShrink:0,padding:"0 4px"}}><span style={{fontSize:11,color:GOLD,fontFamily:MONO,fontWeight:700}}>{p.id}</span></div>
                        <div style={{width:LCOLS[1].w,flexShrink:0,padding:"0 4px"}}>
                          <div style={{fontSize:11,color:"#fff",fontFamily:FONT,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}} title={p.name}>{p.name}</div>
                          <div style={{display:"flex",gap:2,marginTop:2}}>{p.tags.map(t=><TagBadge key={t} tag={t}/>)}</div>
                        </div>
                        <div style={{width:LCOLS[2].w,flexShrink:0,padding:"0 4px"}}><span style={{fontSize:10,color:"rgba(255,255,255,0.82)",fontFamily:FONT,fontWeight:500,display:"block",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.client}</span></div>
                        <div style={{width:LCOLS[3].w,flexShrink:0,padding:"0 4px"}}><span style={{fontSize:10,color:"rgba(255,255,255,0.64)",fontFamily:FONT,display:"block",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.consultant}</span></div>
                        <div style={{width:LCOLS[4].w,flexShrink:0,padding:"0 4px"}}><span style={{fontSize:10,color:"rgba(255,255,255,0.64)",fontFamily:FONT,display:"block",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.contractor}</span></div>
                        <div style={{width:LCOLS[5].w,flexShrink:0,padding:"0 4px"}}><span style={{fontSize:11,color:"#00cc77",fontFamily:MONO,fontWeight:700,whiteSpace:"nowrap"}}>{p.value}</span></div>
                        <div style={{width:LCOLS[6].w,flexShrink:0,padding:"0 4px"}}><span style={{fontSize:10,color:"rgba(255,255,255,0.64)",fontFamily:FONT}}>{p.sales}</span></div>
                      </div>
                    ))}
                    <div style={{height:4}}/>
                  </div>
                </div>
              </div>

              {/* DRAGGABLE DIVIDER */}
              <div
                onMouseDown={startDrag}
              onTouchStart={startDrag}
                style={{width:32,flexShrink:0,cursor:"col-resize",touchAction:"none",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,userSelect:"none",padding:"0 6px"}}
                onMouseEnter={e=>e.currentTarget.querySelector('.drag-line').style.opacity="1"}
                onMouseLeave={e=>e.currentTarget.querySelector('.drag-line').style.opacity="0.55"}>
                <div className="drag-line" style={{width:3,height:"72%",borderRadius:3,background:"linear-gradient(180deg,#7c3aed 0%,#2563eb 25%,#06b6d4 50%,#a855f7 75%,#ec4899 100%)",opacity:0.55,transition:"opacity 0.18s",boxShadow:"0 0 8px rgba(124,58,237,0.50), 0 0 16px rgba(6,182,212,0.30)"}}/>
              </div>

              {/* RIGHT */}
              <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0,borderRadius:8,border:"1px solid rgba(0,160,255,0.12)"}}>
                <div style={{flexShrink:0,height:30,background:"rgba(0,2,12,0.96)",borderBottom:"1px solid rgba(0,160,255,0.11)",display:"flex",alignItems:"center",padding:"0 9px",gap:6}}>
                  <span style={{width:2,height:10,background:`linear-gradient(180deg,${CYAN},rgba(0,140,255,0.26))`,borderRadius:1,flexShrink:0}}/>
                  <span style={{fontFamily:FONT,fontSize:9.5,fontWeight:700,color:"#fff",letterSpacing:"0.06em",textTransform:"uppercase"}}>Pipeline Tracker</span>
                  <div style={{display:"flex",alignItems:"center",gap:4,marginLeft:4,padding:"2px 7px",borderRadius:4,background:"rgba(0,191,255,0.08)",border:"1px solid rgba(0,191,255,0.22)"}}>
                    <span style={{width:4,height:4,borderRadius:"50%",background:"#00bfff",flexShrink:0}}/>
                    <span style={{fontFamily:FONT,fontSize:7.5,color:"rgba(0,191,255,0.85)",fontWeight:600}}>click any cell to change status</span>
                  </div>
                  <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                    {[{l:"Completed",c:"#00cc77"},{l:"In Progress",c:"#ffd600"},{l:"On Hold",c:"#ff9020"},{l:"Overdue",c:"#d05200"},{l:"Risky",c:"#dd3535"}].map(x=>(
                      <div key={x.l} style={{display:"flex",alignItems:"center",gap:3}}>
                        <span style={{width:7,height:7,borderRadius:2,background:x.c,flexShrink:0}}/>
                        <span style={{fontSize:8.5,color:"rgba(255,255,255,0.50)",fontFamily:FONT,fontWeight:500}}>{x.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div ref={rightHdrRef} style={{flexShrink:0,height:HDR_H,background:"rgba(0,2,11,0.92)",borderBottom:"1px solid rgba(0,160,255,0.09)",overflowX:"auto",overflowY:"hidden"}}>
                  <div style={{display:"flex",alignItems:"center",height:"100%",width:PIPE_W+PILL_W+12,minWidth:"100%",paddingLeft:8,gap:GAP}}>
                    {STAGES.map(s=>(
                      <div key={s.key} style={{width:CW,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 2px",overflow:"visible"}}>
                        <span style={{fontSize:9.5,color:"#ffffff",fontFamily:FONT,fontWeight:700,letterSpacing:"0.03em",textTransform:"uppercase",textAlign:"center",lineHeight:1.3,whiteSpace:"normal",wordBreak:"keep-all",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",width:CW}}>{s.label}</span>
                      </div>
                    ))}
                    <div style={{width:PILL_W,flexShrink:0,paddingLeft:10}}>
                      <span style={{fontSize:9.5,color:"rgba(255,255,255,0.45)",fontFamily:FONT,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>Status</span>
                    </div>
                  </div>
                </div>
                <div ref={rightBodyRef} onScroll={syncR} style={{flex:1,overflowY:"scroll",overflowX:"auto"}}>
                  <div style={{width:PIPE_W+PILL_W+12,minWidth:"100%",minHeight:"100%"}}>
                    {pageP.map((p,ri)=>{
                      const pill=derivePill(p.stageStatus);
                      const rowBg=ri%2===0?"rgba(0,3,16,0.50)":"rgba(0,2,9,0.28)";
                      return (
                        <div key={p.id} style={{height:ROW_H,display:"flex",alignItems:"center",borderBottom:"1px solid rgba(0,70,150,0.06)",background:rowBg,paddingLeft:8,paddingRight:8,gap:GAP,transition:"background 0.11s",position:"relative"}}
                          onMouseEnter={e=>e.currentTarget.style.background="rgba(0,46,106,0.20)"}
                          onMouseLeave={e=>e.currentTarget.style.background=rowBg}>
                          {STAGES.map(s=>(
                            <div key={s.key} style={{width:CW,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",overflow:"visible",position:"relative",zIndex:1}}>
                              <PipeCell
                                stageKey={p.id+"-"+s.key}
                                stageLabel={s.label}
                                status={p.stageStatus[s.key]||"none"}
                                interactive={true}
                                onStatusChange={(newStatus)=>{
                                  const ns={...p.stageStatus,[s.key]:newStatus};
                                  updateProject(p.id,ns,p.docs||{});
                                }}
                              />
                            </div>
                          ))}
                          <div style={{width:PILL_W,flexShrink:0,paddingLeft:10}}>
                            <div style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:6,background:pill.bg,border:`1px solid ${pill.bd}`,cursor:"pointer"}}
                              onClick={()=>setOpenProject(p)}>
                              <span style={{width:5,height:5,borderRadius:"50%",background:pill.c,flexShrink:0,boxShadow:`0 0 4px ${pill.c}`,animation:"pulse 2s ease-in-out infinite"}}/>
                              <span style={{fontSize:11,color:pill.c,fontFamily:FONT,whiteSpace:"nowrap",fontWeight:700}}>{pill.text}</span>
                              <span style={{fontSize:8,color:"rgba(255,255,255,0.30)",marginLeft:1}}>↗</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div style={{height:4}}/>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{flexShrink:0,height:40,borderTop:"1px solid rgba(0,160,255,0.11)",background:"rgba(0,2,12,0.98)",display:"flex",alignItems:"center",padding:"0 19px",gap:10}}>
              <div style={{position:"relative",width:220,flexShrink:0}}>
                <svg style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)"}} viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search project, client, consultant…"
                  style={{width:"100%",padding:"5px 8px 5px 25px",borderRadius:5,background:"rgba(0,3,12,0.70)",border:"1px solid rgba(255,255,255,0.10)",color:"#fff",fontSize:10,outline:"none",fontFamily:FONT}}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                {[{l:"Completed",c:"#00cc77"},{l:"In Progress",c:"#ffd600"},{l:"On Hold",c:"#ff9020"},{l:"Overdue",c:"#d05200"},{l:"Risky",c:"#dd3535"}].map(x=>(
                  <div key={x.l} style={{display:"flex",alignItems:"center",gap:3}}>
                    <span style={{width:7,height:7,borderRadius:2,background:x.c,flexShrink:0}}/>
                    <span style={{fontSize:9.5,color:"rgba(255,255,255,0.50)",fontFamily:FONT,fontWeight:500}}>{x.l}</span>
                  </div>
                ))}
              </div>
              <div style={{marginLeft:"auto"}}><Pagination total={filteredTotal} perPage={perPage} page={sp} onPage={p=>setPage(p)} onPerPage={n=>setPerPage(n)}/></div>
            </div>
          </div>

          </div>{/* end vSplitRef */}

        </div>
      </div>
    </>
  );
}
