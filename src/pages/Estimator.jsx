import { useState, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Bot, X, Send, FileText, Zap, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
const model  = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const SYSTEM = `You are APEX, an expert AI estimation assistant for NAFFCO — a world-leading fire protection and fire safety company.
Help with: BOQ analysis, material cost breakdowns, sprinkler/suppression/alarm system estimates, rate analysis, NFPA/FM Global compliance, labour costs, margin strategy.
Respond in structured professional format using sections, bullet points, and tables where helpful.`;

const CHIPS = [
  'Estimate a 5-floor office sprinkler system (2000 m² per floor)',
  'Analyze BOQ and flag pricing anomalies',
  'FM200 suppression rate breakdown — server room 80 m²',
  'Typical margin % for a AED 2M fire alarm project?',
  'NFPA 13 material list for a wet pipe system',
];

export default function Estimator({ onClose }) {
  const [input,    setInput]    = useState('');
  const [output,   setOutput]   = useState('');
  const [loading,  setLoading]  = useState(false);
  const [file,     setFile]     = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [copied,   setCopied]   = useState(false);
  const fileRef = useRef(null);

  const run = async (query = input, attachedFile = file) => {
    const q = (query || '').trim();
    if (!q && !attachedFile) return;
    setLoading(true);
    setOutput('');

    try {
      let parts = [];
      if (attachedFile) {
        const b64 = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload  = () => res(r.result.split(',')[1]);
          r.onerror = rej;
          r.readAsDataURL(attachedFile);
        });
        parts.push({ inlineData: { mimeType: attachedFile.type || 'application/octet-stream', data: b64 } });
      }
      parts.push({ text: `${SYSTEM}\n\nUser request: ${q || 'Analyze the attached document and provide an estimation breakdown.'}` });

      const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
      setOutput(result.response.text());
    } catch (err) {
      console.error(err);
      setOutput('⚠ Could not reach the AI engine. Please check your connection and try again.');
    }
    setLoading(false);
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const clear = () => { setOutput(''); setInput(''); setFile(null); };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position:'fixed',inset:0,zIndex:9600,
        background:'rgba(0,0,10,0.58)',
        backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)',
        animation:'estFade 0.2s ease',
      }}/>

      {/* Glass Panel */}
      <div
        style={{
          position:'fixed',top:'50%',left:'50%',
          transform:'translate(-50%,-50%)',
          zIndex:9700,
          width:'min(700px,calc(100vw - 24px))',
          height:'min(680px,calc(100vh - 40px))',
          display:'flex',flexDirection:'column',
          background:'rgba(6,3,22,0.80)',
          backdropFilter:'blur(40px) saturate(200%)',
          WebkitBackdropFilter:'blur(40px) saturate(200%)',
          border:'1px solid rgba(168,85,247,0.28)',
          borderRadius:22,
          boxShadow:'0 32px 90px rgba(0,0,0,0.72),0 0 0 1px rgba(255,255,255,0.05) inset,0 8px 40px rgba(109,40,217,0.28)',
          overflow:'hidden',
          animation:'estSlide 0.28s cubic-bezier(0.22,1,0.36,1)',
        }}
        onDragOver={e=>{e.preventDefault();setDragOver(true)}}
        onDragLeave={()=>setDragOver(false)}
        onDrop={e=>{e.preventDefault();setDragOver(false);const f=e.dataTransfer.files[0];if(f)setFile(f);}}
      >
        {/* Drag highlight */}
        {dragOver && (
          <div style={{
            position:'absolute',inset:0,zIndex:30,pointerEvents:'none',
            background:'rgba(109,40,217,0.15)',
            border:'2px dashed rgba(168,85,247,0.65)',borderRadius:22,
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:'0.92rem',fontFamily:"'Inter',sans-serif",fontWeight:600,
            color:'rgba(196,181,253,0.85)',letterSpacing:'0.06em',
          }}>Drop file to attach</div>
        )}

        {/* ── Header ── */}
        <div style={{
          display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'14px 18px',flexShrink:0,
          borderBottom:'1px solid rgba(168,85,247,0.14)',
          background:'rgba(109,40,217,0.10)',
        }}>
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <Bot size={16} color="#a855f7"/>
            <span style={{
              fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:'0.74rem',letterSpacing:'0.14em',
              background:'linear-gradient(135deg,#c4b5fd,#f9a8d4,#fdba74)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
            }}>APEX AI ESTIMATION WORKSPACE</span>
          </div>
          <div style={{display:'flex',gap:6}}>
            {output && <>
              <Btn icon={copied?<Check size={13} color="#4ade80"/>:<Copy size={13}/>} onClick={copy} title="Copy output"/>
              <Btn icon={<RotateCcw size={13}/>} onClick={clear} title="Clear"/>
            </>}
            <Btn icon={<X size={14}/>} onClick={onClose} title="Close"/>
          </div>
        </div>

        {/* ── Output / Empty state ── */}
        <div style={{
          flex:1,overflowY:'auto',padding:'24px 26px',
          scrollbarWidth:'thin',scrollbarColor:'rgba(168,85,247,0.18) transparent',
        }}>
          {/* Empty */}
          {!output && !loading && (
            <div style={{
              height:'100%',display:'flex',flexDirection:'column',
              alignItems:'center',justifyContent:'center',gap:22,
            }}>
              <div style={{
                width:76,height:76,borderRadius:'50%',
                background:'radial-gradient(circle,rgba(168,85,247,0.18) 0%,rgba(109,40,217,0.06) 70%)',
                border:'1px solid rgba(168,85,247,0.22)',
                display:'flex',alignItems:'center',justifyContent:'center',
                boxShadow:'0 0 30px rgba(168,85,247,0.14)',
              }}>
                <Sparkles size={30} color="#a855f7"/>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{
                  fontFamily:"'Inter',sans-serif",fontWeight:900,
                  fontSize:'1.30rem',color:'#f1f5f9',marginBottom:8,
                }}>Intelligence Engine Ready.</div>
                <div style={{
                  fontFamily:"'Inter',sans-serif",fontSize:'0.78rem',
                  color:'rgba(148,163,184,0.55)',lineHeight:1.65,maxWidth:380,
                }}>
                  Describe your project, paste a BOQ, or drop a document.<br/>The AI will return a full estimation breakdown.
                </div>
              </div>
              {/* Quick chips */}
              <div style={{display:'flex',flexWrap:'wrap',gap:7,justifyContent:'center',maxWidth:520}}>
                {CHIPS.map((c,i)=>(
                  <button key={i} onClick={()=>run(c,null)} style={{
                    fontFamily:"'Inter',sans-serif",fontSize:'0.70rem',fontWeight:500,
                    padding:'6px 13px',borderRadius:100,cursor:'pointer',
                    background:'rgba(255,255,255,0.04)',border:'1px solid rgba(168,85,247,0.20)',
                    color:'rgba(196,181,253,0.65)',transition:'all 0.15s',letterSpacing:'0.02em',
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(109,40,217,0.22)';e.currentTarget.style.color='#e2d9ff';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.color='rgba(196,181,253,0.65)';}}
                  >{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{
              height:'100%',display:'flex',flexDirection:'column',
              alignItems:'center',justifyContent:'center',gap:16,
            }}>
              <div style={{display:'flex',gap:7,alignItems:'center'}}>
                {[0,1,2,3].map(i=>(
                  <span key={i} style={{
                    width:8,height:8,borderRadius:'50%',
                    background:'rgba(168,85,247,0.80)',display:'inline-block',
                    animation:`estDot 1.3s ease-in-out ${i*0.18}s infinite`,
                  }}/>
                ))}
              </div>
              <div style={{
                fontFamily:"'Inter',sans-serif",fontSize:'0.76rem',
                color:'rgba(148,163,184,0.45)',letterSpacing:'0.08em',
              }}>Analyzing parameters...</div>
            </div>
          )}

          {/* Output */}
          {output && !loading && (
            <div>
              <div style={{
                display:'flex',alignItems:'center',gap:7,marginBottom:16,
              }}>
                <Bot size={13} color="#a855f7"/>
                <span style={{
                  fontFamily:"'Inter',sans-serif",fontSize:'0.60rem',fontWeight:800,
                  letterSpacing:'0.18em',color:'rgba(168,85,247,0.75)',textTransform:'uppercase',
                }}>AI Analysis Output</span>
                <div style={{flex:1,height:1,background:'rgba(168,85,247,0.15)'}}/>
              </div>
              <div style={{
                fontFamily:"'Inter',sans-serif",fontSize:'0.86rem',
                lineHeight:1.78,color:'#cbd5e1',whiteSpace:'pre-wrap',wordBreak:'break-word',
              }}>{output}</div>
            </div>
          )}
        </div>

        {/* ── File badge ── */}
        {file && (
          <div style={{
            display:'flex',alignItems:'center',gap:7,
            margin:'0 16px 2px',padding:'6px 12px',
            background:'rgba(109,40,217,0.12)',border:'1px solid rgba(168,85,247,0.25)',
            borderRadius:9,flexShrink:0,
          }}>
            <FileText size={12} color="#a855f7"/>
            <span style={{
              flex:1,fontFamily:"'Inter',sans-serif",fontSize:'0.72rem',
              color:'rgba(196,181,253,0.80)',
              overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
            }}>{file.name}</span>
            <button onClick={()=>setFile(null)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.30)',padding:2,display:'flex'}}>
              <X size={11}/>
            </button>
          </div>
        )}

        {/* ── Input bar ── */}
        <div style={{
          padding:'10px 14px 13px',flexShrink:0,
          borderTop:'1px solid rgba(168,85,247,0.12)',
          background:'rgba(0,0,0,0.22)',
        }}>
          <div style={{
            display:'flex',gap:8,alignItems:'flex-end',
            background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(168,85,247,0.24)',
            borderRadius:14,padding:'8px 10px',
          }}>
            <button onClick={()=>fileRef.current.click()} title="Attach document" style={{
              background:'none',border:'none',cursor:'pointer',flexShrink:0,
              color:'rgba(168,85,247,0.50)',padding:'4px',display:'flex',
              transition:'color 0.15s',
            }}
              onMouseEnter={e=>e.currentTarget.style.color='rgba(168,85,247,0.90)'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(168,85,247,0.50)'}
            ><FileText size={16}/></button>
            <input ref={fileRef} type="file" style={{display:'none'}} onChange={e=>setFile(e.target.files[0]||null)}/>

            <textarea
              autoFocus
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();run();}}}
              placeholder="Describe the estimation task, paste BOQ, or drop a file…"
              rows={2}
              style={{
                flex:1,resize:'none',background:'none',border:'none',outline:'none',
                color:'#e2e8f0',fontFamily:"'Inter',sans-serif",
                fontSize:'0.83rem',lineHeight:1.55,padding:'4px 2px',
                maxHeight:100,
                scrollbarWidth:'thin',scrollbarColor:'rgba(168,85,247,0.15) transparent',
              }}
            />

            <button
              onClick={()=>run()}
              disabled={loading||(!input.trim()&&!file)}
              style={{
                flexShrink:0,alignSelf:'flex-end',
                width:36,height:36,borderRadius:10,
                display:'flex',alignItems:'center',justifyContent:'center',
                background:loading||(!input.trim()&&!file)
                  ?'rgba(109,40,217,0.15)'
                  :'linear-gradient(135deg,#6d28d9,#a855f7)',
                border:'1px solid rgba(168,85,247,0.35)',
                color:loading||(!input.trim()&&!file)?'rgba(255,255,255,0.22)':'#fff',
                cursor:loading||(!input.trim()&&!file)?'default':'pointer',
                transition:'all 0.15s',
              }}
            >
              {loading ? <Zap size={14} style={{opacity:0.4}}/> : <Send size={14}/>}
            </button>
          </div>

          <div style={{
            textAlign:'center',marginTop:7,
            fontFamily:"'Inter',sans-serif",fontSize:'0.58rem',
            color:'rgba(71,85,105,0.60)',letterSpacing:'0.10em',textTransform:'uppercase',
          }}>Encrypted APEX Workspace · Gemini Powered</div>
        </div>
      </div>

      <style>{`
        @keyframes estFade  { from{opacity:0} to{opacity:1} }
        @keyframes estSlide { from{opacity:0;transform:translate(-50%,-46%)} to{opacity:1;transform:translate(-50%,-50%)} }
        @keyframes estDot   { 0%,80%,100%{opacity:0.15} 40%{opacity:1} }
      `}</style>
    </>
  );
}

function Btn({ icon, onClick, title }) {
  return (
    <button onClick={onClick} title={title} style={{
      background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.09)',
      borderRadius:7,color:'rgba(255,255,255,0.45)',cursor:'pointer',
      width:27,height:27,display:'flex',alignItems:'center',justifyContent:'center',
      transition:'all 0.14s',
    }}
      onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.13)';e.currentTarget.style.color='#fff';}}
      onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='rgba(255,255,255,0.45)';}}
    >{icon}</button>
  );
}