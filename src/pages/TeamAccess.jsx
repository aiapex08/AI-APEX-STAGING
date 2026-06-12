import React, { useState, useEffect, useRef, useMemo } from 'react';

/* ══════════════════════════════════════════════════ CONSTANTS & SEED DATA */

const TA_EMP_KEY  = 'ta_v6_emp';
const TA_PERM_KEY = 'ta_v5_perm';
const DAYS_LABEL  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const OVERRIDE_CODE = 'UNBLK143';
const DEFAULT_TIMER = { enabled:true, startHour:7, endHour:19, days:[1,2,3,4,5] };

const TEAMS        = ['Estimation','Sales','Engineering','Contracts','Sales Order','Admin','Supplier'];
const DESIGNATIONS = ["Director's Hub",'Cost Artist Lead','Cost Artist','Senior Estimator','Estimator','Estimation Engineer','Sales Account Manager','Sales Engineer','Sales Manager','Sales Executive','Senior Engineer','Engineer','Technical Engineer','Project Engineer','Contract Manager','Procurement Officer','Supervisor','Administrator'];
const STATUS_OPTS  = ['Active','On Leave','Resigned'];

const SALARY_FIELDS = [
  {key:'basic',         label:'Basic'},
  {key:'hra',           label:'HRA'},
  {key:'car',           label:'Car'},
  {key:'mobile',        label:'Mobile'},
  {key:'transportation',label:'Transportation'},
  {key:'food',          label:'Food'},
  {key:'others',        label:'Others'},
  {key:'bonus',         label:'Bonus'},
];

const PAGES_LIST = [
  {key:'home',          label:'Home / Main Dashboard',       link:'/',                                               depth:0},
  {key:'estimation',    label:'Estimation Hub',              link:'/estimation-hub',                                 depth:0},
  {key:'newRequest',    label:'New Quote Request',           link:'/estimation-hub/estimation/new-request',          depth:1},
  {key:'openRequests',  label:'Open Requests',               link:'/estimation-hub/estimation/open-requests',        depth:1},
  {key:'sales',         label:'Sales & Marketing',           link:'/estimation-hub/estimation',                      depth:1},
  {key:'salesDashboard',label:'Sales Dashboard',             link:'/estimation-hub/estimation/sales-dashboard',      depth:2},
  {key:'analytics',     label:'Analytics / Data',            link:'/estimation-hub/data',                            depth:1},
  {key:'aiTool',        label:'AI Tool (APEX)',               link:'/estimation-hub/estimation/AIapextool',           depth:1},
  {key:'contracts',     label:'Contracts',                   link:'/estimation-hub/contracts',                       depth:1},
  {key:'engineering',   label:'Engineering',                 link:'/estimation-hub/construction',                    depth:1},
  {key:'teamAccess',    label:'Team Access (Admin)',          link:'/estimation-hub/team-access',                     depth:1},
  {key:'customers',     label:'Customers',                   link:'/estimation-hub/customers',                       depth:1},
  {key:'projectList',   label:'Project List',                link:'/estimation-hub/projects',                        depth:1},
  {key:'teamHub',       label:'Team Hub',                    link:'/estimation-hub/team',                            depth:1},
  {key:'costingArt',    label:'Costing Art (Director)',       link:'/estimation-hub/estimation/estimation-dashboard', depth:1},
];

const TA_LINKS_KEY = 'ta_v5_links';
const DEF_LINKS = Object.fromEntries(PAGES_LIST.map(p=>[p.key, p.link]));
const loadLinks = () => { try{ const s=localStorage.getItem(TA_LINKS_KEY); if(s) return {...DEF_LINKS,...JSON.parse(s)}; }catch{} return {...DEF_LINKS}; };
const saveLinks = l => { try{ localStorage.setItem(TA_LINKS_KEY,JSON.stringify(l)); }catch{} };

const DEF_PERMS = Object.fromEntries(PAGES_LIST.map(p => [p.key, {1:true,2:true,3:false}]));
Object.assign(DEF_PERMS, {
  analytics:  {1:true,2:false,3:false},
  teamAccess: {1:true,2:false,3:false},
  costingArt: {1:true,2:false,3:false},
  contracts:  {1:true,2:false,3:false},
  engineering:{1:true,2:false,3:false},
});

const EMPTY_SAL = {basic:0,hra:0,car:0,mobile:0,transportation:0,food:0,others:0,bonus:0};

const SEED = [
  // ── Admins / Directors (L1) ──────────────────────────────────────────────────────────────────────
  {id:'u001',photo:null,    name:'Ganesh Shetty',                    empNo:'EST-ADM',designation:'Cost Artist Lead',     team:'Estimation', salary:{...EMPTY_SAL},doj:'',          status:'Active',level:1,accessCode:'EST-ADM'},
  {id:'u002',photo:'/S.jpg',name:'Emelaine Jane',                    empNo:'NA2569', designation:'Cost Artist',          team:'Estimation', salary:{basic:2300,hra:600, car:0,   mobile:50, transportation:0,   food:0,others:1050,bonus:0},doj:'2022-09-26',status:'Active',level:1,accessCode:'STAR'},
  {id:'u023',photo:null,    name:'Nour Alyazji',                     empNo:'7STAR',  designation:"Director's Hub",       team:'Admin',      salary:{...EMPTY_SAL},doj:'',          status:'Active',level:1,accessCode:'7STAR'},
  // ── Estimation Engineers (L2) ────────────────────────────────────────────────────────────────────
  {id:'u003',photo:'/g.jpg',name:'Sachin Poojary',                   empNo:'NF10603',designation:'Estimation Engineer',  team:'Estimation', salary:{basic:5400,hra:1800,car:0,   mobile:150,transportation:900, food:0,others:750, bonus:0},doj:'2023-10-03',status:'Active',level:2,accessCode:'EX552'},
  {id:'u004',photo:'/h.jpg',name:'Mohammad Samee Hamid Khan',        empNo:'NE615',  designation:'Estimation Engineer',  team:'Estimation', salary:{basic:3400,hra:1500,car:0,   mobile:0,  transportation:0,   food:0,others:2100,bonus:0},doj:'2018-03-14',status:'Active',level:2,accessCode:'EX719'},
  {id:'u005',photo:'/i.jpg',name:'Moazzam Ali',                      empNo:'NF5086', designation:'Estimation Engineer',  team:'Estimation', salary:{basic:3000,hra:1500,car:0,   mobile:0,  transportation:700, food:0,others:2800,bonus:0},doj:'2017-04-30',status:'Active',level:2,accessCode:'EX638'},
  {id:'u006',photo:'/j.jpg',name:'Benson Benjamine',                 empNo:'NF11845',designation:'Estimation Engineer',  team:'Estimation', salary:{basic:3900,hra:1300,car:0,   mobile:150,transportation:0,   food:0,others:1150,bonus:0},doj:'2024-11-20',status:'Active',level:2,accessCode:'EX904'},
  {id:'u007',photo:'/K.jpg',name:'Pranav Manjalam Kandiyil',         empNo:'NF9947', designation:'Estimation Engineer',  team:'Estimation', salary:{basic:3500,hra:2450,car:0,   mobile:100,transportation:0,   food:0,others:2400,bonus:0},doj:'2023-04-06',status:'Active',level:2,accessCode:'EX471'},
  {id:'u008',photo:'/L.jpg',name:'Saeem Sajid Gadkari',              empNo:'NF8337', designation:'Estimation Engineer',  team:'Estimation', salary:{basic:4000,hra:2000,car:0,   mobile:100,transportation:0,   food:0,others:1500,bonus:0},doj:'2021-11-28',status:'Active',level:2,accessCode:'EX856'},
  {id:'u009',photo:'/M.jpg',name:'Jaffar Shaik',                     empNo:'NF11094',designation:'Estimation Engineer',  team:'Estimation', salary:{basic:3300,hra:2600,car:0,   mobile:150,transportation:0,   food:0,others:950, bonus:0},doj:'2024-04-22',status:'Active',level:2,accessCode:'EX392'},
  {id:'u021',photo:null,    name:'Muzafar Khasab Abdul',             empNo:'EX681',  designation:'Estimation Engineer',  team:'Estimation', salary:{...EMPTY_SAL},doj:'',          status:'Active',level:2,accessCode:'EX681'},
  {id:'u017',photo:null,    name:'Afridi Miyan Basheer',             empNo:'NF12065',designation:'Estimation Engineer',  team:'Estimation', salary:{basic:3000,hra:2000,car:0,   mobile:150,transportation:0,   food:0,others:1850,bonus:0},doj:'2025-02-17',status:'Active',level:2,accessCode:'EX547'},
  {id:'u022',photo:null,    name:'Alfaj Muhammad',                   empNo:'EX903',  designation:'Estimation Engineer',  team:'Estimation', salary:{...EMPTY_SAL},doj:'',          status:'Active',level:2,accessCode:'EX903'},
  {id:'u018',photo:null,    name:'Vimal Vencent',                    empNo:'NF12971',designation:'Estimation Engineer',  team:'Estimation', salary:{basic:3900,hra:1300,car:0,   mobile:150,transportation:0,   food:0,others:1150,bonus:0},doj:'2025-08-06',status:'Active',level:2,accessCode:'EX764'},
  {id:'u025',photo:null,    name:'Armela Ebalde Arboleda',             empNo:'NA762',  designation:'Estimation Coordinator',     team:'Estimation', salary:{basic:2600,hra:1950,car:0,   mobile:0,  transportation:0,   food:0,others:450, bonus:0},doj:'2014-01-13',status:'Active',level:2,accessCode:'NA762'},
  {id:'u024',photo:null,    name:'Aswin Raj Kuzhipurath Mannil Rajeev',empNo:'NF11846',designation:'Estimation Engineer',         team:'Estimation', salary:{basic:3000,hra:1000,car:0,   mobile:150,transportation:0,   food:0,others:850, bonus:0},doj:'2024-11-20',status:'Active',level:2,accessCode:'NF11846'},
  {id:'u026',photo:null,    name:'Elangovan Sivaraj',                  empNo:'NF11125',designation:'Senior Estimation Engineer',  team:'Estimation', salary:{basic:6600,hra:2200,car:0,   mobile:200,transportation:0,   food:0,others:4200,bonus:0},doj:'2024-05-13',status:'Active',level:2,accessCode:'NF11125'},
  // ── Sales (L2) ──────────────────────────────────────────────────────────────────────────────────
  {id:'u010',photo:'/A.jpg',name:'Ammar Khaldoun',                   empNo:'NF12226',designation:'Sales Engineer',       team:'Sales',      salary:{basic:3600,hra:0,   car:0,   mobile:150,transportation:600, food:0,others:1650,bonus:0},doj:'2025-04-14',status:'Active',level:2,accessCode:'SX985'},
  {id:'u011',photo:'/b.jpg',name:'Ashik Bin Shams',                  empNo:'NF13386',designation:'Sales Engineer',       team:'Sales',      salary:{basic:4000,hra:1500,car:0,   mobile:100,transportation:1500,food:0,others:100, bonus:0},doj:'2025-10-12',status:'Active',level:2,accessCode:'SX417'},
  {id:'u012',photo:'/c.jpg',name:'Mohammad Hindawi',                 empNo:'NF13443',designation:'Sales Executive',      team:'Sales',      salary:{basic:2400,hra:0,   car:0,   mobile:100,transportation:0,   food:0,others:1500,bonus:0},doj:'2025-11-03',status:'Active',level:2,accessCode:'SE628'},
  {id:'u013',photo:'/d.jpg',name:'Ibrahim Odeh',                     empNo:'SE842',  designation:'Sales Executive',      team:'Sales',      salary:{...EMPTY_SAL},doj:'',          status:'Active',level:2,accessCode:'SE842'},
  {id:'u014',photo:'/e.jpg',name:'Yazan Al Agha',                    empNo:'NF10512',designation:'Sales Executive',      team:'Sales',      salary:{basic:4250,hra:2500,car:1000,mobile:100,transportation:1000,food:0,others:350, bonus:0},doj:'2023-09-18',status:'Active',level:2,accessCode:'SE519'},
  {id:'u016',photo:null,    name:'Almira Abogado',                   empNo:'NF12730',designation:'Sales Executive',      team:'Sales',      salary:{basic:2700,hra:900, car:0,   mobile:100,transportation:0,   food:0,others:800, bonus:0},doj:'2025-07-09',status:'Active',level:2,accessCode:'SE421'},
  {id:'u015',photo:'/f.jpg',name:'Ali Hussnain',                     empNo:'NF7964', designation:'Sales Account Manager',team:'Sales',      salary:{basic:6000,hra:3300,car:0,   mobile:150,transportation:1800,food:0,others:1950,bonus:0},doj:'2021-08-16',status:'Active',level:2,accessCode:'SM386'},
  {id:'u027',photo:null,    name:'Fe Marie Cuyos',                   empNo:'NF11785',designation:'Customer Service Coordinator',team:'Sales',  salary:{basic:1800,hra:600, car:0,   mobile:50, transportation:0,   food:0,others:550, bonus:0},doj:'2024-11-11',status:'Active',level:2,accessCode:'NF11785'},
  // ── Engineering (L2) ────────────────────────────────────────────────────────────────────────────
  {id:'u019',photo:null,    name:'Mohammad Adnan Khan',              empNo:'NF14341',designation:'Technical Engineer',   team:'Engineering',salary:{basic:5400,hra:1800,car:0,   mobile:150,transportation:900, food:0,others:750, bonus:0},doj:'2026-03-11',status:'Active',level:2,accessCode:'NF14341'},
  {id:'u020',photo:null,    name:'Motasem Khalifah Hamdan Nawafleh',empNo:'NF12188',designation:'Project Engineer',      team:'Engineering',salary:{basic:2700,hra:0,   car:0,   mobile:100,transportation:0,   food:0,others:1700,bonus:0},doj:'2025-04-03',status:'Active',level:2,accessCode:'NF12188'},
];

/* ══════════════════════════════════════════════════ HELPERS */

const computeGross = s => SALARY_FIELDS.reduce((acc, f) => acc + (Number(s[f.key])||0), 0);

const ageInOrg = doj => {
  if (!doj) return '—';
  const ms = Date.now() - new Date(doj).getTime();
  if (ms < 0) return '—';
  const y = Math.floor(ms/(1000*60*60*24*365));
  const m = Math.floor((ms%(1000*60*60*24*365))/(1000*60*60*24*30));
  if (y > 0) return `${y}y ${m}m`;
  if (m > 0) return `${m}m`;
  return '< 1m';
};

const fmtDate = d => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); }
  catch { return '—'; }
};

const fmtCur = n => Number(n) ? `AED ${Number(n).toLocaleString()}` : '—';

const loadEmps = () => {
  try {
    const s = localStorage.getItem(TA_EMP_KEY);
    if (s) {
      const stored = JSON.parse(s);
      const storedIds = new Set(stored.map(e=>e.id));
      const additions = SEED.filter(e=>!storedIds.has(e.id)).map(e=>({...e,salary:{...e.salary}}));
      if (additions.length > 0) {
        const merged = [...stored, ...additions];
        try { localStorage.setItem(TA_EMP_KEY, JSON.stringify(merged)); } catch {}
        return merged;
      }
      return stored;
    }
  } catch {}
  return SEED.map(e=>({...e,salary:{...e.salary}}));
};
const loadPerms = () => {
  try { const s=localStorage.getItem(TA_PERM_KEY); if(s) return JSON.parse(s); } catch{}
  return JSON.parse(JSON.stringify(DEF_PERMS));
};
const saveEmps  = e => { try{ localStorage.setItem(TA_EMP_KEY,  JSON.stringify(e)); }catch{} };
const savePerms = p => { try{ localStorage.setItem(TA_PERM_KEY, JSON.stringify(p)); }catch{} };

/* ══════════════════════════════════════════════════ SUB-COMPONENTS */

const F = "'Inter','Segoe UI',sans-serif";
const BD = 'rgba(255,255,255,0.08)';
const BDH = 'rgba(255,255,255,0.16)';
const TXT = 'rgba(255,255,255,0.88)';
const TXT2 = 'rgba(255,255,255,0.45)';
const TXT3 = 'rgba(255,255,255,0.22)';
const ROW_BG = 'rgba(255,255,255,0.02)';
const ROW_HOV = 'rgba(255,255,255,0.05)';
const ACCT = '#0078d4';

const Avatar = ({ name='', photo=null, size=36, onUpload=null }) => {
  const initials = name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
  const hue = (name.charCodeAt(0)*7+(name.charCodeAt(1)||0)*13)%360;
  const ref = useRef();
  return (
    <div style={{position:'relative',flexShrink:0,width:size,height:size}}>
      {photo
        ? <img src={photo} alt={name} style={{width:size,height:size,borderRadius:'50%',objectFit:'cover',border:`1.5px solid rgba(140,190,255,0.22)`,display:'block'}}/>
        : <div style={{width:size,height:size,borderRadius:'50%',background:`hsl(${hue},50%,26%)`,border:`1.5px solid rgba(140,190,255,0.18)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.32,fontWeight:700,color:`hsl(${hue},75%,72%)`,fontFamily:F,letterSpacing:'0.04em'}}>
            {initials}
          </div>
      }
      {onUpload && <>
        <div className="av-hover" style={{position:'absolute',inset:0,borderRadius:'50%',background:'rgba(0,0,0,0.55)',display:'none',alignItems:'center',justifyContent:'center',cursor:'pointer'}}
          onClick={()=>ref.current?.click()}>
          <svg width={size*0.32} height={size*0.32} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>
        <div className="av-hover" style={{position:'absolute',inset:0,borderRadius:'50%',cursor:'pointer',opacity:0}}
          onMouseEnter={e=>{e.currentTarget.previousSibling.style.display='flex';}}
          onMouseLeave={e=>{e.currentTarget.previousSibling.style.display='none';}}
          onClick={()=>ref.current?.click()}/>
        <input ref={ref} type="file" accept="image/*" style={{display:'none'}}
          onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>onUpload(ev.target.result);r.readAsDataURL(f);}}/>
      </>}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = {Active:{c:'#22c55e',b:'rgba(34,197,94,0.12)',bd:'rgba(34,197,94,0.28)'},'On Leave':{c:'#fb923c',b:'rgba(251,146,60,0.12)',bd:'rgba(251,146,60,0.28)'},Resigned:{c:'#ef4444',b:'rgba(239,68,68,0.10)',bd:'rgba(239,68,68,0.25)'}}[status]||{c:TXT2,b:'rgba(255,255,255,0.05)',bd:BD};
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'2px 9px',borderRadius:20,background:cfg.b,border:`1px solid ${cfg.bd}`,fontSize:'0.60rem',fontWeight:700,color:cfg.c,letterSpacing:'0.08em',textTransform:'uppercase',whiteSpace:'nowrap',fontFamily:F}}>
      <span style={{width:5,height:5,borderRadius:'50%',background:cfg.c,flexShrink:0}}/>
      {status}
    </span>
  );
};

const LvlBadge = ({ level }) => {
  const cfg = {1:{c:'rgba(251,191,36,0.90)',b:'rgba(251,191,36,0.10)',bd:'rgba(251,191,36,0.28)',label:'L1 · Admin'},2:{c:'rgba(96,165,250,0.90)',b:'rgba(96,165,250,0.10)',bd:'rgba(96,165,250,0.25)',label:'L2 · Member'},3:{c:'rgba(148,163,184,0.80)',b:'rgba(148,163,184,0.08)',bd:'rgba(148,163,184,0.20)',label:'L3 · Viewer'}}[level]||{c:TXT3,b:'transparent',bd:BD,label:`L${level}`};
  return <span style={{padding:'2px 8px',borderRadius:20,background:cfg.b,border:`1px solid ${cfg.bd}`,fontSize:'0.58rem',fontWeight:700,color:cfg.c,letterSpacing:'0.06em',fontFamily:F,whiteSpace:'nowrap'}}>{cfg.label}</span>;
};

const InpField = ({value='',onChange,type='text',placeholder='',style={},...rest}) => (
  <input value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder}
    style={{background:'rgba(255,255,255,0.06)',border:`1px solid ${ACCT}`,borderRadius:5,padding:'4px 8px',color:TXT,fontSize:'0.75rem',fontFamily:F,outline:'none',width:'100%',boxSizing:'border-box',...style}}
    {...rest}/>
);

const Sel = ({value,onChange,children,style={}}) => (
  <select value={value} onChange={e=>onChange(e.target.value)}
    style={{background:'#1a1a22',border:`1px solid ${ACCT}`,borderRadius:5,padding:'4px 7px',color:TXT,fontSize:'0.75rem',fontFamily:F,outline:'none',...style}}>
    {children}
  </select>
);

const Btn = ({children,onClick,variant='default',small=false,style={},...rest}) => {
  const variants = {
    default:{bg:'rgba(255,255,255,0.07)',bd:BD,c:TXT2,hBg:'rgba(255,255,255,0.12)',hBd:BDH,hC:TXT},
    primary:{bg:ACCT,bd:'transparent',c:'#fff',hBg:'#106ebe',hBd:'transparent',hC:'#fff'},
    success:{bg:'rgba(16,124,16,0.90)',bd:'transparent',c:'#fff',hBg:'rgba(16,124,16,1)',hBd:'transparent',hC:'#fff'},
    danger: {bg:'rgba(197,15,31,0.15)',bd:'rgba(197,15,31,0.35)',c:'rgba(255,120,120,0.90)',hBg:'rgba(197,15,31,0.28)',hBd:'rgba(197,15,31,0.60)',hC:'#ff8888'},
    ghost:  {bg:'transparent',bd:'transparent',c:TXT3,hBg:'rgba(255,255,255,0.06)',hBd:'transparent',hC:TXT},
  };
  const v = variants[variant]||variants.default;
  const p = small ? '3px 10px' : '5px 13px';
  return (
    <button onClick={onClick}
      style={{display:'inline-flex',alignItems:'center',gap:5,padding:p,borderRadius:5,background:v.bg,border:`1px solid ${v.bd}`,color:v.c,fontSize:small?'0.66rem':'0.72rem',fontWeight:600,fontFamily:F,cursor:'pointer',outline:'none',transition:'all 0.14s',whiteSpace:'nowrap',...style}}
      onMouseEnter={e=>{e.currentTarget.style.background=v.hBg;e.currentTarget.style.borderColor=v.hBd;e.currentTarget.style.color=v.hC;}}
      onMouseLeave={e=>{e.currentTarget.style.background=v.bg;e.currentTarget.style.borderColor=v.bd;e.currentTarget.style.color=v.c;}}
      {...rest}>
      {children}
    </button>
  );
};

/* ══════════════════════════════════════════════════ ICON HELPERS */
const IcEdit   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcDel    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>;
const IcSave   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcCancel = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcAdd    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcChev   = ({up=false}) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transform:up?'rotate(180deg)':'none',transition:'transform 0.2s'}}><polyline points="6 9 12 15 18 9"/></svg>;

/* ══════════════════════════════════════════════════ PAGE 1: TEAMS DIRECTORY */

const COL = '40px 54px 90px 1fr 140px 120px 110px 90px 90px 120px';

const TblHead = ({ sort, setSort }) => {
  const cols = [
    {id:'',label:''},
    {id:'photo',label:'Photo'},
    {id:'empNo',label:'Emp #'},
    {id:'name',label:'Name'},
    {id:'designation',label:'Designation'},
    {id:'team',label:'Team'},
    {id:'gross',label:'Salary (Gross)'},
    {id:'doj',label:'DOJ'},
    {id:'age',label:'Age in Org'},
    {id:'status',label:'Status'},
  ];
  return (
    <div style={{display:'grid',gridTemplateColumns:COL,gap:6,padding:'6px 16px 6px 8px',borderBottom:`1px solid ${BD}`,flexShrink:0}}>
      {cols.map(c=>(
        <div key={c.id} onClick={c.id&&c.id!=='photo'?()=>setSort(s=>({col:c.id,dir:s.col===c.id&&s.dir==='asc'?'desc':'asc'})):undefined}
          style={{fontSize:'0.54rem',letterSpacing:'0.14em',textTransform:'uppercase',color:sort.col===c.id?ACCT:TXT3,fontWeight:700,cursor:c.id&&c.id!=='photo'?'pointer':'default',display:'flex',alignItems:'center',gap:3,userSelect:'none'}}>
          {c.label}
          {sort.col===c.id && <span style={{fontSize:'0.55rem'}}>{sort.dir==='asc'?'↑':'↓'}</span>}
        </div>
      ))}
    </div>
  );
};

function TeamsDirectory({ employees, setEmployees }) {
  const [search, setSearch]         = useState('');
  const [filterTeam, setFilterTeam] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sort, setSort]             = useState({col:'name',dir:'asc'});
  const [editingId, setEditingId]   = useState(null);  // null | 'new' | empId
  const [draft, setDraft]           = useState(null);
  const [expanded, setExpanded]     = useState(new Set());
  const [delConfirm, setDelConfirm] = useState(null);

  const setDraftField = (field, val) => setDraft(d=>({...d,[field]:val}));
  const setDraftSal   = (field, val) => setDraft(d=>({...d,salary:{...d.salary,[field]:val}}));

  const startEdit = emp => { setDraft({...emp,salary:{...emp.salary}}); setEditingId(emp.id); };
  const startAdd  = () => {
    const newEmp = {id:`u${Date.now()}`,photo:null,name:'',empNo:'',designation:DESIGNATIONS[2],team:TEAMS[0],salary:{...EMPTY_SAL},doj:'',status:'Active',level:2,accessCode:''};
    setDraft(newEmp); setEditingId('new');
    setExpanded(s=>{const n=new Set(s);n.add('new');return n;});
  };
  const commitEdit = () => {
    if (!draft.name.trim()) return;
    const gross = computeGross(draft.salary);
    const final = {...draft,salary:{...draft.salary,gross}};
    if (editingId === 'new') {
      setEmployees(e=>[final,...e]);
    } else {
      setEmployees(e=>e.map(x=>x.id===editingId?final:x));
    }
    setEditingId(null); setDraft(null);
  };
  const cancelEdit = () => { setEditingId(null); setDraft(null); };
  const deleteEmp  = id => { setEmployees(e=>e.filter(x=>x.id!==id)); setDelConfirm(null); };
  const toggleExpand = id => setExpanded(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  const uploadPhoto = (id, dataUrl) => {
    if (editingId===id) { setDraftField('photo', dataUrl); }
    else { setEmployees(e=>e.map(x=>x.id===id?{...x,photo:dataUrl}:x)); }
  };

  const filtered = useMemo(()=>{
    let rows = employees.filter(e=>
      (filterTeam==='All'||e.team===filterTeam) &&
      (filterStatus==='All'||e.status===filterStatus) &&
      (!search||(e.name+e.empNo+e.designation).toLowerCase().includes(search.toLowerCase()))
    );
    rows = [...rows].sort((a,b)=>{
      let av=a[sort.col]||'', bv=b[sort.col]||'';
      if (sort.col==='gross') { av=computeGross(a.salary); bv=computeGross(b.salary); }
      if (sort.col==='age')   { av=a.doj?new Date(a.doj).getTime():0; bv=b.doj?new Date(b.doj).getTime():0; return sort.dir==='asc'?av-bv:bv-av; }
      if (typeof av==='string') return sort.dir==='asc'?av.localeCompare(bv):bv.localeCompare(av);
      return sort.dir==='asc'?av-bv:bv-av;
    });
    return rows;
  }, [employees,search,filterTeam,filterStatus,sort]);

  const renderRow = (emp, isNew=false) => {
    const isEditing = editingId===emp.id;
    const isExp = expanded.has(emp.id);
    const gross = computeGross(emp.salary);
    const d = isEditing ? draft : emp;
    const bg = isEditing ? 'rgba(0,120,212,0.07)' : isNew ? 'rgba(16,124,16,0.06)' : ROW_BG;
    const bd = isEditing ? `1px solid rgba(0,120,212,0.35)` : `1px solid ${BD}`;

    return (
      <div key={emp.id} style={{marginBottom:2}}>
        <div style={{display:'grid',gridTemplateColumns:COL,gap:6,padding:'7px 8px',background:bg,border:bd,borderRadius:isExp?'7px 7px 0 0':'7px',alignItems:'center',transition:'background 0.15s'}}
          onMouseEnter={e=>{if(!isEditing)e.currentTarget.style.background=ROW_HOV;}}
          onMouseLeave={e=>{if(!isEditing)e.currentTarget.style.background=bg;}}>

          {/* Expand toggle */}
          <button onClick={()=>toggleExpand(emp.id)} style={{background:'transparent',border:'none',cursor:'pointer',color:TXT3,padding:2,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <IcChev up={isExp}/>
          </button>

          {/* Photo */}
          <Avatar name={d.name} photo={d.photo} size={34} onUpload={isEditing ? v=>setDraftField('photo',v) : v=>uploadPhoto(emp.id,v)}/>

          {/* Emp # */}
          {isEditing
            ? <InpField value={d.empNo} onChange={v=>setDraftField('empNo',v)} placeholder="Emp #" style={{maxWidth:80}}/>
            : <span style={{fontFamily:'monospace',fontSize:'0.68rem',color:'rgba(160,205,255,0.80)',letterSpacing:'0.06em'}}>{emp.empNo||'—'}</span>
          }

          {/* Name */}
          {isEditing
            ? <InpField value={d.name} onChange={v=>setDraftField('name',v)} placeholder="Full Name*"/>
            : <div>
                <div style={{fontSize:'0.78rem',fontWeight:600,color:TXT,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{emp.name}</div>
                <div style={{fontSize:'0.58rem',color:TXT3,marginTop:1}}>{emp.designation}</div>
              </div>
          }

          {/* Designation */}
          {isEditing
            ? <Sel value={d.designation} onChange={v=>setDraftField('designation',v)}>{DESIGNATIONS.map(x=><option key={x}>{x}</option>)}</Sel>
            : <span style={{fontSize:'0.68rem',color:TXT2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{emp.designation}</span>
          }

          {/* Team */}
          {isEditing
            ? <Sel value={d.team} onChange={v=>setDraftField('team',v)} style={{maxWidth:110}}>{TEAMS.map(x=><option key={x}>{x}</option>)}</Sel>
            : <span style={{fontSize:'0.68rem',color:TXT2}}>{emp.team}</span>
          }

          {/* Salary Gross */}
          <button onClick={()=>toggleExpand(emp.id)} style={{background:'transparent',border:'none',cursor:'pointer',color: gross>0?'rgba(52,211,153,0.85)':TXT3,fontSize:'0.70rem',fontWeight:gross>0?600:400,fontFamily:F,padding:0,textAlign:'left',display:'flex',alignItems:'center',gap:4}}>
            {gross>0 ? fmtCur(gross) : <span style={{color:TXT3,fontSize:'0.64rem'}}>— set salary</span>}
            <span style={{fontSize:'0.55rem',color:TXT3,opacity:0.7}}>▾</span>
          </button>

          {/* DOJ */}
          {isEditing
            ? <InpField value={d.doj} onChange={v=>setDraftField('doj',v)} type="date" style={{maxWidth:120,colorScheme:'dark'}}/>
            : <span style={{fontSize:'0.68rem',color:TXT2}}>{fmtDate(emp.doj)}</span>
          }

          {/* Age in Org */}
          <span style={{fontSize:'0.68rem',color:TXT2}}>{ageInOrg(isEditing?d.doj:emp.doj)}</span>

          {/* Status */}
          {isEditing
            ? <Sel value={d.status} onChange={v=>setDraftField('status',v)} style={{maxWidth:110}}>{STATUS_OPTS.map(x=><option key={x}>{x}</option>)}</Sel>
            : <StatusBadge status={emp.status}/>
          }
        </div>

        {/* Expanded salary + actions row */}
        {isExp && (
          <div style={{background:isEditing?'rgba(0,120,212,0.05)':'rgba(0,0,0,0.25)',border:`1px solid ${isEditing?'rgba(0,120,212,0.25)':BD}`,borderTop:'none',borderRadius:'0 0 7px 7px',padding:'12px 16px'}}>
            {/* Salary breakdown */}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:'0.56rem',letterSpacing:'0.16em',textTransform:'uppercase',color:TXT3,marginBottom:8,fontWeight:700}}>Salary Breakdown (AED)</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:8}}>
                {SALARY_FIELDS.map(f=>(
                  <div key={f.key} style={{display:'flex',flexDirection:'column',gap:3}}>
                    <label style={{fontSize:'0.56rem',letterSpacing:'0.12em',textTransform:'uppercase',color:TXT3,fontWeight:600}}>{f.label}</label>
                    {isEditing
                      ? <InpField value={d.salary[f.key]||''} onChange={v=>setDraftSal(f.key,v)} type="number" placeholder="0" style={{textAlign:'right'}}/>
                      : <span style={{fontSize:'0.72rem',color: emp.salary[f.key]>0?'rgba(52,211,153,0.80)':TXT3,fontFamily:'monospace'}}>{fmtCur(emp.salary[f.key])}</span>
                    }
                  </div>
                ))}
                {/* Gross total */}
                <div style={{display:'flex',flexDirection:'column',gap:3,padding:'6px 8px',background:'rgba(52,211,153,0.07)',border:'1px solid rgba(52,211,153,0.18)',borderRadius:5}}>
                  <label style={{fontSize:'0.56rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(52,211,153,0.60)',fontWeight:700}}>Gross Total</label>
                  <span style={{fontSize:'0.82rem',fontWeight:700,color:'rgba(52,211,153,0.90)',fontFamily:'monospace'}}>
                    {fmtCur(isEditing ? computeGross(d.salary) : gross)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{display:'flex',gap:8,paddingTop:8,borderTop:`1px solid ${BD}`}}>
              {isEditing ? <>
                <Btn variant="success" onClick={commitEdit}><IcSave/> Save</Btn>
                <Btn variant="default" onClick={cancelEdit}><IcCancel/> Cancel</Btn>
              </> : <>
                <Btn variant="primary" small onClick={()=>startEdit(emp)}><IcEdit/> Edit</Btn>
                <Btn variant="danger"  small onClick={()=>setDelConfirm(emp.id)}><IcDel/> Delete</Btn>
              </>}
            </div>
          </div>
        )}

        {/* Delete confirm */}
        {delConfirm===emp.id && (
          <div style={{padding:'10px 16px',background:'rgba(197,15,31,0.10)',border:'1px solid rgba(197,15,31,0.28)',borderRadius:7,marginTop:2,display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:'0.72rem',color:'rgba(255,120,120,0.90)',flex:1}}>Remove <strong>{emp.name}</strong>? This cannot be undone.</span>
            <Btn variant="danger"  small onClick={()=>deleteEmp(emp.id)}>Delete</Btn>
            <Btn variant="default" small onClick={()=>setDelConfirm(null)}>Cancel</Btn>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      {/* Toolbar */}
      <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 16px',flexShrink:0,borderBottom:`1px solid ${BD}`,flexWrap:'wrap'}}>
        <div style={{position:'relative',flex:'1 1 200px',minWidth:160}}>
          <svg style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',opacity:0.3}} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, Emp#, designation…"
            style={{width:'100%',background:'rgba(255,255,255,0.05)',border:`1px solid ${BD}`,borderRadius:5,padding:'6px 10px 6px 28px',color:TXT,fontSize:'0.75rem',fontFamily:F,outline:'none',boxSizing:'border-box'}}/>
        </div>
        <select value={filterTeam} onChange={e=>setFilterTeam(e.target.value)}
          style={{background:'rgba(255,255,255,0.05)',border:`1px solid ${BD}`,borderRadius:5,padding:'6px 10px',color:TXT2,fontSize:'0.72rem',fontFamily:F,outline:'none',cursor:'pointer'}}>
          <option value="All">All Teams</option>
          {TEAMS.map(t=><option key={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
          style={{background:'rgba(255,255,255,0.05)',border:`1px solid ${BD}`,borderRadius:5,padding:'6px 10px',color:TXT2,fontSize:'0.72rem',fontFamily:F,outline:'none',cursor:'pointer'}}>
          <option value="All">All Status</option>
          {STATUS_OPTS.map(s=><option key={s}>{s}</option>)}
        </select>
        <span style={{fontSize:'0.60rem',color:TXT3,letterSpacing:'0.08em'}}>{filtered.length} employees</span>
        <Btn variant="primary" onClick={startAdd}><IcAdd/> Add Employee</Btn>
      </div>

      {/* Table Header */}
      <TblHead sort={sort} setSort={setSort}/>

      {/* Rows */}
      <div style={{flex:1,overflowY:'auto',padding:'8px 16px 24px'}}>
        {/* New row at top */}
        {editingId==='new' && renderRow({...draft,id:'new'},true)}

        {filtered.length===0 && editingId!=='new' && (
          <div style={{textAlign:'center',paddingTop:60,color:TXT3,fontSize:'0.80rem'}}>No employees found</div>
        )}
        {filtered.map(emp => renderRow(emp))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════ PAGE 2: ACCESS CONTROL */

function AccessControl({ employees, setEmployees, levelPerms, setLevelPerms }) {
  const [editingAccId, setEditingAccId] = useState(null);
  const [accDraft, setAccDraft]         = useState(null);
  const [permsDirty, setPermsDirty]     = useState(false);
  const [pageLinks, setPageLinks]       = useState(loadLinks);
  const [editingLinkKey, setEditingLinkKey] = useState(null);
  const [linkDraft, setLinkDraft]       = useState('');
  const updateLink = (key, val) => {
    setPageLinks(l=>{ const n={...l,[key]:val}; saveLinks(n); return n; });
  };
  const startLinkEdit = key => { setEditingLinkKey(key); setLinkDraft(pageLinks[key]||''); };
  const commitLinkEdit = () => { if(editingLinkKey) updateLink(editingLinkKey, linkDraft.trim()); setEditingLinkKey(null); };
  const [permsDraft, setPermsDraft]     = useState(()=>JSON.parse(JSON.stringify(levelPerms)));
  const [savedAnim, setSavedAnim]       = useState(false);
  const [search, setSearch]             = useState('');

  const startAccEdit = emp => { setAccDraft({id:emp.id,accessCode:emp.accessCode||'',level:emp.level||2,designation:emp.designation||''}); setEditingAccId(emp.id); };
  const saveAccEdit  = () => {
    setEmployees(e=>e.map(x=>x.id===editingAccId?{...x,accessCode:accDraft.accessCode,level:accDraft.level,designation:accDraft.designation}:x));
    setEditingAccId(null); setAccDraft(null);
  };
  const togglePerm = (page, lvl) => {
    setPermsDraft(d=>{const n=JSON.parse(JSON.stringify(d));n[page][lvl]=!n[page][lvl];return n;});
    setPermsDirty(true);
  };
  const savePerms = () => {
    setLevelPerms(JSON.parse(JSON.stringify(permsDraft)));
    setPermsDirty(false);
    setSavedAnim(true);
    setTimeout(()=>setSavedAnim(false),2000);
  };

  const filtered = employees.filter(e=>
    !search || (e.name+e.empNo).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{display:'flex',flexDirection:'row',height:'100%',overflow:'hidden'}}>

      {/* ── LEFT: Employee Access ── */}
      <div style={{flex:'0 0 58%',display:'flex',flexDirection:'column',borderRight:`1px solid ${BD}`,overflow:'hidden',minWidth:0}}>
        {/* Header */}
        <div style={{flexShrink:0,borderBottom:`1px solid ${BD}`}}>
          {/* Live-auth notice */}
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 16px',background:'rgba(34,197,94,0.05)',borderBottom:`1px solid rgba(34,197,94,0.14)`}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#22c55e',flexShrink:0}}/>
            <span style={{fontSize:'0.58rem',color:'rgba(34,197,94,0.80)',letterSpacing:'0.10em',textTransform:'uppercase',fontWeight:700}}>Live Auth —</span>
            <span style={{fontSize:'0.60rem',color:TXT3}}>Access code, level, and status changes take effect immediately on the next login attempt.</span>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px 8px',gap:10}}>
            <div>
              <div style={{fontSize:'0.64rem',letterSpacing:'0.16em',textTransform:'uppercase',color:TXT3,fontWeight:700}}>Employee Access</div>
              <div style={{fontSize:'0.58rem',color:TXT3,marginTop:2}}>Access codes and permission levels per employee</div>
            </div>
            <div style={{position:'relative',flex:'0 1 200px'}}>
              <svg style={{position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',opacity:0.3}} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…"
                style={{width:'100%',background:'rgba(255,255,255,0.05)',border:`1px solid ${BD}`,borderRadius:5,padding:'5px 10px 5px 26px',color:TXT,fontSize:'0.72rem',fontFamily:F,outline:'none',boxSizing:'border-box'}}/>
            </div>
          </div>
          {/* Grid header */}
          <div style={{display:'grid',gridTemplateColumns:'36px 1fr 140px 110px 110px 120px 110px 100px',gap:8,padding:'5px 16px',borderTop:`1px solid ${BD}`}}>
            {['','Name','Designation','Team','Status','Code','Level','Actions'].map((h,i)=>(
              <div key={i} style={{fontSize:'0.52rem',letterSpacing:'0.14em',textTransform:'uppercase',color:TXT3,fontWeight:700}}>{h}</div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div style={{flex:1,overflowY:'auto',padding:'6px 16px'}}>
          {filtered.map(emp=>{
            const isEditing = editingAccId===emp.id;
            const d = isEditing ? accDraft : emp;
            return (
              <div key={emp.id} style={{display:'grid',gridTemplateColumns:'36px 1fr 140px 110px 110px 120px 110px 100px',gap:8,padding:'6px 8px',marginBottom:2,background:isEditing?'rgba(0,120,212,0.07)':ROW_BG,border:`1px solid ${isEditing?'rgba(0,120,212,0.30)':BD}`,borderRadius:6,alignItems:'center',transition:'background 0.14s'}}
                onMouseEnter={e=>{if(!isEditing)e.currentTarget.style.background=ROW_HOV;}}
                onMouseLeave={e=>{if(!isEditing)e.currentTarget.style.background=isEditing?'rgba(0,120,212,0.07)':ROW_BG;}}>
                <Avatar name={emp.name} photo={emp.photo} size={30}/>
                <div style={{fontSize:'0.75rem',fontWeight:600,color:TXT,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{emp.name}</div>
                {isEditing
                  ? <Sel value={d.designation} onChange={v=>setAccDraft(x=>({...x,designation:v}))} style={{width:'100%'}}>{DESIGNATIONS.map(x=><option key={x}>{x}</option>)}</Sel>
                  : <span style={{fontSize:'0.68rem',color:TXT2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{emp.designation||'—'}</span>
                }
                <span style={{fontSize:'0.68rem',color:TXT2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{emp.team||'—'}</span>
                <StatusBadge status={emp.status}/>
                {isEditing
                  ? <InpField value={d.accessCode} onChange={v=>setAccDraft(x=>({...x,accessCode:v}))} placeholder="Access Code" style={{fontFamily:'monospace'}}/>
                  : <span style={{fontFamily:'monospace',fontSize:'0.68rem',color:'rgba(160,205,255,0.82)',letterSpacing:'0.08em',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{emp.accessCode||'—'}</span>
                }
                {isEditing
                  ? <Sel value={d.level} onChange={v=>setAccDraft(x=>({...x,level:Number(v)}))}>
                      <option value={1}>Level 1 — Admin</option>
                      <option value={2}>Level 2 — Member</option>
                      <option value={3}>Level 3 — Viewer</option>
                    </Sel>
                  : <LvlBadge level={emp.level}/>
                }
                <div style={{display:'flex',gap:5}}>
                  {isEditing ? <>
                    <Btn variant="success" small onClick={saveAccEdit}><IcSave/> Save</Btn>
                    <Btn variant="ghost"   small onClick={()=>{setEditingAccId(null);setAccDraft(null);}}><IcCancel/></Btn>
                  </> :
                    <Btn variant="ghost" small onClick={()=>startAccEdit(emp)}><IcEdit/> Edit</Btn>
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT: Page Permissions Matrix ── */}
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minWidth:0}}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px 8px',flexShrink:0,borderBottom:`1px solid ${BD}`}}>
          <div>
            <div style={{fontSize:'0.64rem',letterSpacing:'0.16em',textTransform:'uppercase',color:TXT3,fontWeight:700}}>Page Permissions</div>
            <div style={{fontSize:'0.58rem',color:TXT3,marginTop:2}}>Which pages each level can access</div>
          </div>
          <Btn variant={savedAnim?'success':'primary'} onClick={savePerms}>
            {savedAnim ? <><IcSave/> Saved!</> : <><IcSave/> Save</>}
          </Btn>
        </div>

        {/* Matrix */}
        <div style={{flex:1,overflowY:'auto',overflowX:'auto',padding:'0 14px 24px'}}>
          {/* Table header */}
          <div style={{minWidth:480}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 170px 70px 70px 70px',gap:4,padding:'6px 10px',background:'rgba(255,255,255,0.04)',borderRadius:'6px 6px 0 0',border:`1px solid ${BD}`,borderBottom:'none',marginTop:8}}>
            <div style={{fontSize:'0.56rem',letterSpacing:'0.14em',textTransform:'uppercase',color:TXT3,fontWeight:700}}>Page / Feature</div>
            <div style={{fontSize:'0.56rem',letterSpacing:'0.14em',textTransform:'uppercase',color:TXT3,fontWeight:700}}>Link / Route</div>
            {[1,2,3].map(l=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'0.56rem',letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700,color:{1:'rgba(251,191,36,0.80)',2:'rgba(96,165,250,0.80)',3:'rgba(148,163,184,0.70)'}[l]}}>L{l}</div>
                <div style={{fontSize:'0.50rem',color:TXT3,marginTop:1}}>{['Admin','Member','Viewer'][l-1]}</div>
              </div>
            ))}
          </div>

          {PAGES_LIST.map((page,idx)=>{
            const isOdd = idx%2===0;
            const isEditingLink = editingLinkKey===page.key;
            return (
              <div key={page.key} style={{display:'grid',gridTemplateColumns:'1fr 170px 70px 70px 70px',gap:4,padding:'7px 10px',background:isOdd?'rgba(255,255,255,0.02)':'transparent',border:`1px solid ${BD}`,borderTop:'none',borderRadius:idx===PAGES_LIST.length-1?'0 0 6px 6px':'0',alignItems:'center'}}>
                <div style={{fontSize:'0.70rem',color:page.depth>0?TXT2:TXT,display:'flex',alignItems:'center',gap:5,paddingLeft:page.depth*14}}>
                  {page.depth===0
                    ? <span style={{width:5,height:5,borderRadius:'50%',background:'rgba(0,120,212,0.60)',flexShrink:0}}/>
                    : <span style={{color:'rgba(100,160,255,0.30)',fontSize:'0.68rem',flexShrink:0,fontFamily:'monospace',letterSpacing:'-0.04em'}}>{page.depth===2?'  └─':'└─'}</span>
                  }
                  {page.label}
                </div>
                <div>
                  {isEditingLink
                    ? <input autoFocus value={linkDraft} onChange={e=>setLinkDraft(e.target.value)} onBlur={commitLinkEdit}
                        onKeyDown={e=>{ if(e.key==='Enter') commitLinkEdit(); if(e.key==='Escape') setEditingLinkKey(null); }}
                        style={{width:'100%',background:'rgba(0,120,212,0.10)',border:`1px solid ${ACCT}`,borderRadius:4,padding:'3px 7px',color:TXT,fontSize:'0.68rem',fontFamily:'monospace',outline:'none',boxSizing:'border-box'}}/>
                    : <span onClick={()=>startLinkEdit(page.key)} title="Click to edit"
                        style={{fontSize:'0.63rem',color:'rgba(96,165,250,0.75)',fontFamily:'monospace',cursor:'text',display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',padding:'2px 4px',borderRadius:3,border:'1px solid transparent',transition:'border-color 0.14s'}}
                        onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(96,165,250,0.30)'}
                        onMouseLeave={e=>e.currentTarget.style.borderColor='transparent'}>
                        {pageLinks[page.key]||<span style={{color:TXT3,fontStyle:'italic'}}>—</span>}
                      </span>
                  }
                </div>
                {[1,2,3].map(lvl=>{
                  const checked = !!permsDraft[page.key]?.[lvl];
                  const acc = {1:'rgba(251,191,36,0.80)',2:'rgba(96,165,250,0.80)',3:'rgba(148,163,184,0.70)'}[lvl];
                  return (
                    <div key={lvl} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                      <button onClick={()=>togglePerm(page.key,lvl)}
                        style={{width:20,height:20,borderRadius:4,background:checked?acc.replace('0.80','0.15'):'rgba(255,255,255,0.04)',border:`1.5px solid ${checked?acc:'rgba(255,255,255,0.16)'}`,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.14s',flexShrink:0,outline:'none'}}>
                        {checked && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke={acc} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Level legend */}
          <div style={{marginTop:12,display:'flex',gap:14,flexWrap:'wrap'}}>
            {[
              {l:1,desc:'Director & Admin'},
              {l:2,desc:'Team Member'},
              {l:3,desc:'Viewer'},
            ].map(({l,desc})=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:6}}>
                <LvlBadge level={l}/>
                <span style={{fontSize:'0.60rem',color:TXT3}}>{desc}</span>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════════ MAIN EXPORT */

export default function TeamAccess({ onBack, currentUser = null }) {
  const [employees, setEmployees] = useState(loadEmps);
  const [levelPerms, setLevelPerms] = useState(loadPerms);
  const [activeTab, setActiveTab] = useState('access');
  const [timer, setTimer]         = useState(()=>{ try{const s=localStorage.getItem('ta_timer');return s?JSON.parse(s):DEFAULT_TIMER;}catch{return DEFAULT_TIMER;} });
  const [showTimer, setShowTimer] = useState(false);
  const [now, setNow]             = useState(new Date());

  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),30000); return ()=>clearInterval(t); },[]);
  useEffect(()=>{ saveEmps(employees); },[employees]);
  useEffect(()=>{ savePerms(levelPerms); },[levelPerms]);
  useEffect(()=>{ try{localStorage.setItem('ta_timer',JSON.stringify(timer));}catch{} },[timer]);

  const setLevelPermsAndSave = p => { setLevelPerms(p); savePerms(p); };

  // Access guard — only L1 admins/directors
  if (currentUser && currentUser.level !== 1) {
    return (
      <div style={{position:'fixed',inset:0,zIndex:200,background:'linear-gradient(135deg,#0a0a10 0%,#0d0a1e 50%,#080614 100%)',fontFamily:F,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
        <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(239,68,68,0.10)',border:'1.5px solid rgba(239,68,68,0.28)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'0.90rem',fontWeight:700,color:'rgba(239,68,68,0.90)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:6}}>Access Restricted</div>
          <div style={{fontSize:'0.70rem',color:TXT3,maxWidth:300,lineHeight:1.6}}>Team Access is reserved for Admins and Directors only. Contact your administrator for access.</div>
        </div>
        <button onClick={onBack} style={{marginTop:8,background:'rgba(255,255,255,0.06)',border:`1px solid ${BD}`,borderRadius:6,padding:'7px 20px',cursor:'pointer',color:TXT2,fontSize:'0.70rem',letterSpacing:'0.10em',textTransform:'uppercase'}}>Go Back</button>
      </div>
    );
  }

  const allowed = isWithinAllowedTime(timer);
  const dayLabel  = DAYS_LABEL[now.getDay()];
  const timeLabel = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  const tabs = [
    {id:'directory', label:'Teams Directory', icon:'👥'},
    {id:'access',    label:'Access Control',  icon:'🔐'},
  ];

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:'linear-gradient(135deg,#0a0a10 0%,#0d0a1e 50%,#080614 100%)',fontFamily:F,color:TXT,overflow:'hidden',display:'flex',flexDirection:'column'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
        @keyframes ta-aurora{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes ta-pulse{0%,100%{opacity:0.5}50%{opacity:1}}
        ::-webkit-scrollbar{width:4px;height:4px;background:rgba(255,255,255,0.03)}
        ::-webkit-scrollbar-thumb{background:rgba(140,190,255,0.14);border-radius:3px}
        select option{background:#12121c}
        input[type=number]::-webkit-inner-spin-button{opacity:0.4}
      `}</style>

      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 55% 35% at 50% -5%,rgba(124,58,237,0.12) 0%,transparent 70%)',pointerEvents:'none'}}/>

      {/* ── TOP HEADER ── */}
      <div style={{position:'relative',zIndex:10,display:'flex',alignItems:'center',gap:16,padding:'10px 20px',borderBottom:`1px solid ${BD}`,flexShrink:0,background:'rgba(0,0,0,0.30)',backdropFilter:'blur(10px)'}}>
        <button onClick={onBack}
          style={{background:'none',border:`1px solid ${BD}`,borderRadius:100,padding:'5px 13px',cursor:'pointer',color:TXT2,fontSize:'0.68rem',letterSpacing:'0.12em',textTransform:'uppercase',display:'flex',alignItems:'center',gap:5,transition:'all 0.2s',flexShrink:0}}
          onMouseEnter={e=>{e.currentTarget.style.color=TXT;e.currentTarget.style.borderColor=BDH;}}
          onMouseLeave={e=>{e.currentTarget.style.color=TXT2;e.currentTarget.style.borderColor=BD;}}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>

        <div>
          <h1 style={{margin:0,fontFamily:"'Cinzel',serif",fontSize:'clamp(0.90rem,2vw,1.25rem)',fontWeight:700,letterSpacing:'0.10em',textTransform:'uppercase',background:'linear-gradient(90deg,#00e5ff,#7c3aed,#a855f7,#00e5ff)',backgroundSize:'300% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'ta-aurora 5s ease infinite'}}>Team Access</h1>
          <div style={{fontSize:'0.54rem',letterSpacing:'0.22em',textTransform:'uppercase',color:TXT3,marginTop:1}}>Admin · HR & Access Control</div>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:2,background:'rgba(255,255,255,0.04)',border:`1px solid ${BD}`,borderRadius:7,padding:3,marginLeft:8}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              style={{padding:'6px 16px',borderRadius:5,background:activeTab===t.id?ACCT:'transparent',border:`1px solid ${activeTab===t.id?ACCT:'transparent'}`,color:activeTab===t.id?'#fff':TXT2,fontSize:'0.70rem',fontWeight:600,cursor:'pointer',fontFamily:F,transition:'all 0.16s',outline:'none',display:'flex',alignItems:'center',gap:5,whiteSpace:'nowrap'}}>
              <span style={{fontSize:'0.80rem'}}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:10}}>

          {/* Live auth indicator */}
          <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',background:'rgba(34,197,94,0.07)',border:'1px solid rgba(34,197,94,0.22)',borderRadius:6}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#22c55e',animation:'ta-pulse 1.8s ease-in-out infinite',flexShrink:0}}/>
            <span style={{fontSize:'0.54rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(34,197,94,0.80)',fontWeight:700}}>Live Auth</span>
          </div>

          {/* Logged-in admin badge */}
          {currentUser && (
            <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',background:'rgba(124,58,237,0.08)',border:'1px solid rgba(124,58,237,0.22)',borderRadius:6}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.80)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span style={{fontSize:'0.58rem',color:'rgba(167,139,250,0.85)',fontWeight:600,letterSpacing:'0.04em',whiteSpace:'nowrap'}}>{currentUser.name}</span>
              <span style={{fontSize:'0.50rem',color:TXT3,letterSpacing:'0.08em',textTransform:'uppercase'}}>{currentUser.designation}</span>
            </div>
          )}

          {/* Status + timer */}
          <div style={{textAlign:'right',lineHeight:1.3}}>
            <div style={{fontSize:'0.68rem',fontWeight:600,color:'rgba(200,220,255,0.85)',letterSpacing:'0.04em'}}>{dayLabel} · {timeLabel}</div>
            <div style={{fontSize:'0.52rem',letterSpacing:'0.14em',textTransform:'uppercase',color:allowed?'#22c55e':'#ef4444',display:'flex',alignItems:'center',justifyContent:'flex-end',gap:4,marginTop:1}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:allowed?'#22c55e':'#ef4444',animation:'ta-pulse 2s ease-in-out infinite'}}/>
              {allowed?'Access Open':'Outside Hours'}
            </div>
          </div>
          <button onClick={()=>setShowTimer(v=>!v)}
            style={{background:'rgba(255,255,255,0.05)',border:`1px solid ${BD}`,borderRadius:6,padding:'6px 11px',cursor:'pointer',color:'rgba(160,205,255,0.75)',fontSize:'0.64rem',fontWeight:600,letterSpacing:'0.08em',display:'flex',alignItems:'center',gap:5,transition:'all 0.16s',outline:'none'}}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.09)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Timer
          </button>
        </div>
      </div>

      {/* Timer panel */}
      {showTimer && (
        <div style={{flexShrink:0,borderBottom:`1px solid ${BD}`,background:'rgba(0,0,0,0.40)',backdropFilter:'blur(8px)'}}>
          <div style={{padding:'12px 20px',display:'flex',flexWrap:'wrap',gap:20,alignItems:'flex-start'}}>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <div style={{fontSize:'0.56rem',letterSpacing:'0.16em',textTransform:'uppercase',color:TXT3}}>Access Timer</div>
              <div style={{display:'flex',alignItems:'center',gap:9}}>
                <button onClick={()=>setTimer(t=>({...t,enabled:!t.enabled}))} style={{position:'relative',width:40,height:20,borderRadius:10,border:'none',padding:0,background:timer.enabled?'rgba(34,197,94,0.75)':'rgba(255,255,255,0.10)',cursor:'pointer',flexShrink:0,transition:'background 0.22s'}}>
                  <div style={{position:'absolute',top:2,left:timer.enabled?22:2,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left 0.22s'}}/>
                </button>
                <span style={{fontSize:'0.68rem',color:timer.enabled?'#22c55e':TXT3,fontWeight:600}}>{timer.enabled?'Active':'Disabled'}</span>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <div style={{fontSize:'0.56rem',letterSpacing:'0.16em',textTransform:'uppercase',color:TXT3}}>Hours</div>
              <div style={{display:'flex',alignItems:'center',gap:7}}>
                {['startHour','endHour'].map((field,fi)=>(
                  <React.Fragment key={field}>
                    {fi>0 && <span style={{color:TXT3,fontSize:'0.68rem'}}>to</span>}
                    <select value={timer[field]} onChange={e=>setTimer(t=>({...t,[field]:+e.target.value}))} disabled={!timer.enabled}
                      style={{background:'rgba(255,255,255,0.06)',border:`1px solid ${BD}`,borderRadius:5,padding:'4px 8px',color:TXT,fontSize:'0.72rem',outline:'none',opacity:timer.enabled?1:0.4}}>
                      {Array.from({length:24},(_,i)=><option key={i} value={i}>{String(i).padStart(2,'0')}:00</option>)}
                    </select>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <div style={{fontSize:'0.56rem',letterSpacing:'0.16em',textTransform:'uppercase',color:TXT3}}>Working Days</div>
              <div style={{display:'flex',gap:4}}>
                {DAYS_LABEL.map((d,i)=>(
                  <button key={i} onClick={()=>{if(!timer.enabled)return;setTimer(t=>({...t,days:t.days.includes(i)?t.days.filter(x=>x!==i):[...t.days,i].sort((a,b)=>a-b)}));}}
                    style={{width:30,height:24,borderRadius:5,border:'none',cursor:timer.enabled?'pointer':'default',background:timer.days.includes(i)?'rgba(124,58,237,0.55)':'rgba(255,255,255,0.06)',color:timer.days.includes(i)?'#fff':TXT3,fontSize:'0.58rem',fontWeight:600,opacity:timer.enabled?1:0.4,transition:'all 0.16s'}}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6,marginLeft:'auto'}}>
              <div style={{fontSize:'0.56rem',letterSpacing:'0.16em',textTransform:'uppercase',color:TXT3}}>Override Code</div>
              <div style={{background:'rgba(255,200,60,0.06)',border:'1px solid rgba(255,200,60,0.18)',borderRadius:5,padding:'4px 11px',fontSize:'0.68rem',color:'rgba(255,200,60,0.72)',fontFamily:'monospace',letterSpacing:'0.12em'}}>{OVERRIDE_CODE}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── PAGE CONTENT ── */}
      <div style={{flex:1,overflow:'hidden',position:'relative'}}>
        {activeTab==='directory' && (
          <TeamsDirectory employees={employees} setEmployees={setEmployees}/>
        )}
        {activeTab==='access' && (
          <AccessControl employees={employees} setEmployees={setEmployees} levelPerms={levelPerms} setLevelPerms={setLevelPermsAndSave}/>
        )}
      </div>
    </div>
  );
}

function isWithinAllowedTime(timer) {
  const now = new Date();
  return timer.days.includes(now.getDay()) && now.getHours() >= timer.startHour && now.getHours() < timer.endHour;
}
