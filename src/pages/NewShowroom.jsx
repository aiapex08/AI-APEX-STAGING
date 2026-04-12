import React, { useState, useRef, useEffect } from "react";

/* ═══════════════════ SHOWROOM SLIDES ═══════════════════════ */
const BASE = "/"; // local public folder — place images in /public/
const SHOWROOM_SLIDES = [
  { id:"glassdoor", label:"Glass Door",       accent:"120,195,225", dim:0.48, tint:"rgba(10,60,95,0.18)",  url:`${BASE}glassdoor.jpg`  },{ id:"shutter",   label:"Shutter",        accent:"155,145,130", dim:0.55, tint:"rgba(35,30,15,0.22)",  url:`${BASE}shutter.jpg`    },
  { id:"blastdoor", label:"Blast Door",       accent:"110,135,170", dim:0.48, tint:"rgba(20,30,60,0.22)",  url:`${BASE}blast.jpg`      },
  { id:"firedoor",  label:"Fire Door",        accent:"225,70,30",   dim:0.46, tint:"rgba(150,20,5,0.30)",  url:`${BASE}firedoor.jpg`   },
  { id:"smokecurt", label:"Smoke Curtain",    accent:"170,170,185", dim:0.44, tint:"rgba(45,45,65,0.24)",  url:`${BASE}smoke.jpg`      },
  { id:"rollshut",  label:"Rolling Shutter",  accent:"175,155,115", dim:0.52, tint:"rgba(55,40,10,0.20)",  url:`${BASE}shutter.jpg`    },
  { id:"bullet",    label:"Bulletproof Door", accent:"90,165,120",  dim:0.48, tint:"rgba(10,40,22,0.22)",  url:`${BASE}bullet.jpg`     },
];

/* ═══════════════════ BACKGROUNDS ═══════════════════════════ */
const BACKGROUNDS = [
  { id:"showroom", label:"Showroom",  url:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80", accent:"200,165,115", dim:0.52 },
  { id:"factory",  label:"Factory",   url:"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80", accent:"100,150,220", dim:0.45 },
  { id:"office",   label:"Office",    url:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80", accent:"120,190,150", dim:0.48 },
  { id:"dispatch", label:"Dispatch",  url:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=80", accent:"190,130,90",  dim:0.50 },
  { id:"site",     label:"Site",      url:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80", accent:"130,175,120", dim:0.45 },
];

/* ═══════════════════ MODULE ROWS ════════════════════════════ */
const ROW1 = [
  { id:"sales",    label:"Sales &\nMarketing",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="13" width="4" height="8" rx="1"/><rect x="9" y="8" width="4" height="13" rx="1"/><rect x="16" y="3" width="4" height="18" rx="1"/></svg> },
  { id:"contracts",label:"Contracts",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="13" y2="15"/><path d="M14 18l1.5 1.5L18 17"/></svg> },
  { id:"estimate", label:"Estimation",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
  { id:"happy",    label:"Customer\nHappiness",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 14.5Q12 18.5 16 14.5"/><circle cx="9" cy="10" r="1.2" fill="currentColor"/><circle cx="15" cy="10" r="1.2" fill="currentColor"/></svg> },
];
const ROW2 = [
  { id:"tech",     label:"Technical",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
  { id:"maint",    label:"Maintenance",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3-3a6 6 0 01-7.5 7.5l-5.1 5.1a2.1 2.1 0 01-3-3l5.1-5.1a6 6 0 017.5-7.5l-3 3z"/></svg> },
  { id:"factory",  label:"Factory",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="8" width="20" height="13" rx="1.5"/><path d="M2 14l5-4v4l5-4v4l5-4v4"/><rect x="5" y="3" width="3" height="5" rx="0.5"/><rect x="11" y="3" width="3" height="5" rx="0.5"/><rect x="17" y="3" width="3" height="5" rx="0.5"/></svg> },
  { id:"showroom", label:"Showroom",   showroomMenu:true,
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="12" y1="4" x2="12" y2="20"/><rect x="4" y="12" width="5" height="6" rx="0.8" fill="currentColor" opacity="0.18"/><rect x="15" y="12" width="5" height="6" rx="0.8" fill="currentColor" opacity="0.18"/></svg> },
];
const ROW3 = [
  { id:"finance",  label:"Account &\nFinance",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
  { id:"training", label:"Training\nCenter",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10l-10-6L2 10l10 6 10-6z"/><path d="M6 12.5v4c0 2.5 4.5 4 6 4s6-1.5 6-4v-4"/><line x1="22" y1="10" x2="22" y2="16"/><circle cx="22" cy="18" r="1.2" fill="currentColor"/></svg> },
  { id:"hr",       label:"HR",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="3.5"/><path d="M2 21c0-3.9 3.1-7 7-7h4c3.9 0 7 3.1 7 7"/><circle cx="19" cy="8" r="2.5"/><path d="M22 21c0-2.8-1.3-5.2-3.3-6.5"/></svg> },
  { id:"dispatch", label:"Dispatch",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="22" r="1.5" fill="currentColor" stroke="none"/><circle cx="20" cy="22" r="1.5" fill="currentColor" stroke="none"/></svg> },
];

const WORKFLOW = [
  // Quotation — price tag
  { label:"Quotation",          d:"M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" },
  // Costing — calculator
  { label:"Costing",            d:"M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zM9 7h6M9 11h2m4 0h.01M9 15h.01M13 15h.01M17 15h.01M9 19h8" },
  // Sales — handshake / deal
  { label:"Sales",              d:"M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1M15 4H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l4-4h4a2 2 0 002-2V6a2 2 0 00-2-2z" },
  // Contracts — signed document with pen
  { label:"Contracts",          d:"M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5zM14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h4" },
  // Sales Order — shopping cart with tick
  { label:"Sales Order",        d:"M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" },
  // Planning — gantt / calendar with tasks
  { label:"Planning",           d:"M3 4h18v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4zM3 9h18M8 2v3M16 2v3M7 13h2v2H7zM15 13h2v2h-2z" },
  // PQ — pre-qualification shield with checkmark
  { label:"PQ",                 d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" },
  // Project Photos — camera
  { label:"Project Photos",     d:"M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z" },
  // Samples — flask / test tube
  { label:"Samples",            d:"M9 3h6m-5 0v6l-4 9a1 1 0 001 1h10a1 1 0 001-1l-4-9V3M5 16h14" },
  // Material Submittal — upload / send box
  { label:"Material Submittal", d:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" },
  // Shop Drawings — ruler & pencil
  { label:"Shop Drawings",      d:"M15 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7zM14 2v5h5M8 13h8M8 17h5" },
  // Variations — arrows changing direction
  { label:"Variations",         d:"M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" },
  // Dispatch — delivery truck leaving
  { label:"Dispatch",           d:"M1 10h15v9H1zM16 13l5 2.5V19h-5zM5 20a2 2 0 100-4 2 2 0 000 4zM13 20a2 2 0 100-4 2 2 0 000 4z" },
  // Suppliers — factory / building supply
  { label:"Suppliers",          d:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10" },
  // Production — cog / gear manufacturing
  { label:"Production",         d:"M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9 1.65 1.65 0 004.27 7.18l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" },
  // Delivery — package with location pin
  { label:"Delivery",           d:"M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z" },
  // MIR — clipboard with magnifier (material inspection)
  { label:"MIR",                d:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h5m4-18v5h5m-3 5a3 3 0 11-6 0 3 3 0 016 0zm1.5 4.5L21 21" },
  // WIR — wrench on clipboard (works inspection)
  { label:"WIR",                d:"M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3-3a6 6 0 01-7.5 7.5l-5.1 5.1a2.1 2.1 0 01-3-3l5.1-5.1a6 6 0 017.5-7.5l-3 3z" },
  // Payment Apps — credit card / payment
  { label:"Payment Apps",       d:"M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  // Invoice — receipt with dollar lines
  { label:"Invoice",            d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 0a2 2 0 012-2h0a2 2 0 012 2m-4 0h4M9 12h6M9 16h4" },
  // Certificates — award ribbon / badge
  { label:"Certificates",       d:"M12 15a6 6 0 100-12 6 6 0 000 12zM8.21 13.89L7 23l5-3 5 3-1.21-9.12" },
  // After Sales — headset support
  { label:"After Sales",        d:"M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" },
  // Maintenance — tools / wrench & screwdriver
  { label:"Maintenance",        d:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065zM12 15a3 3 0 100-6 3 3 0 000 6z" },
  // HR — id badge / employee card
  { label:"HR",                 d:"M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3h-8M12 12a2 2 0 100-4 2 2 0 000 4zM8 17s.5-2 4-2 4 2 4 2" },
];
const FIN_METRICS = [
  { id:'salesorder', label:'Sales Order', iconD:"M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
    value:'273k$', color:'120,195,225',
    pts:[18,28,46,72,95,74,58,42,35,48,40,34],
    bars:[{label:'Jul',val:55},{label:'Aug',val:72},{label:'Sep',val:68},{label:'Oct',val:91},{label:'Nov',val:60},{label:'Dec',val:48}] },
  { id:'invoice',    label:'Invoice',     iconD:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 0a2 2 0 012-2h0a2 2 0 012 2m-4 0h4M9 12h6M9 16h4",
    value:'241k$', color:'170,210,140',
    pts:[22,35,55,48,70,88,65,50,42,60,55,40],
    bars:[{label:'Jul',val:42},{label:'Aug',val:58},{label:'Sep',val:75},{label:'Oct',val:61},{label:'Nov',val:84},{label:'Dec',val:70}] },
  { id:'collection', label:'Collection',  iconD:"M3 6h18M3 10h18M3 14h12M3 18h8",
    value:'198k$', color:'225,175,80',
    pts:[15,22,40,55,75,60,48,38,30,42,35,28],
    bars:[{label:'Jul',val:38},{label:'Aug',val:52},{label:'Sep',val:44},{label:'Oct',val:77},{label:'Nov',val:65},{label:'Dec',val:55}] },
  { id:'netprofit',  label:'Net Profit',  iconD:"M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
    value:'87k$', color:'200,120,220',
    pts:[10,15,28,38,52,45,35,28,22,30,26,20],
    bars:[{label:'Jul',val:22},{label:'Aug',val:35},{label:'Sep',val:28},{label:'Oct',val:48},{label:'Nov',val:40},{label:'Dec',val:32}] },
];

/* ── Glass ───────────────────────────────────────────────── */
const Glass = ({children,style={}}) => (
  <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',backdropFilter:'blur(20px) saturate(1.2)',WebkitBackdropFilter:'blur(20px) saturate(1.2)',boxShadow:'0 4px 24px rgba(0,0,0,0.18),0 1px 0 rgba(255,255,255,0.07) inset',borderRadius:18,...style}}>{children}</div>
);
const Icon = ({d,size=16,color="currentColor"}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);

/* ── Statistics chart ────────────────────────────────────── */
const SparklineOnly = ({pts,bars,accent,fill}) => {
  const W=282,H=130;
  const max=Math.max(...pts),min=Math.min(...pts);
  const xs=pts.map((_,i)=>(i/(pts.length-1))*W);
  const ys=pts.map(p=>H*0.72-((p-min)/(max-min))*H*0.55-4);
  const line=xs.map((x,i)=>`${i?'L':'M'}${x},${ys[i]}`).join(' ');
  const area=`${line} L${W},${H*0.72} L0,${H*0.72} Z`;
  const bw=W/bars.length; const bmax=Math.max(...bars.map(b=>b.val)); const ai=3;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:fill?'100%':'auto',overflow:'visible',display:'block'}} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="la" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={`rgba(${accent},0.22)`}/><stop offset="100%" stopColor={`rgba(${accent},0)`}/></linearGradient>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={`rgba(${accent},0.90)`}/><stop offset="100%" stopColor={`rgba(${accent},0.30)`}/></linearGradient>
      </defs>
      {bars.map((b,i)=>{const bx=i*bw+bw*0.22;const bwi=bw*0.56;const isA=i===ai;const bh=isA?H*0.72-4:(b.val/bmax)*(H*0.38);const by=H*0.72-bh;return(<g key={i}><rect x={bx} y={by} width={bwi} height={bh} rx="5" fill={isA?"url(#bg)":"rgba(255,255,255,0.12)"} opacity={isA?1:0.55}/>{isA&&<rect x={bx} y={by} width={bwi} height={5} rx="3" fill="rgba(255,255,255,0.55)"/>}</g>);})}
      <path d={area} fill="url(#la)"/>
      <path d={line} fill="none" stroke={`rgba(${accent},0.95)`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={xs.map((x,i)=>`${i?'L':'M'}${x},${ys[i]+14}`).join(' ')} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      {xs.map((x,i)=><circle key={i} cx={x} cy={ys[i]} r={i===ai?4.5:2} fill={i===ai?"white":`rgba(${accent},0.75)`} stroke={i===ai?`rgba(${accent},0.5)`:"none"} strokeWidth="2.5"/>)}
      {bars.map((b,i)=><text key={b.label} x={i*bw+bw*0.5} y={H-2} textAnchor="middle" fontSize="8.5" fill={i===ai?`rgba(${accent},1)`:"rgba(255,255,255,0.36)"} fontWeight={i===ai?600:400} fontFamily="'Segoe UI Variable','Segoe UI',system-ui">{b.label}</text>)}
    </svg>
  );
};

/* ── Circular progress ───────────────────────────────────── */
const CircProg = ({val,accent}) => {const r=28,c=2*Math.PI*r;return(<svg viewBox="0 0 72 72" width={72} height={72}><circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6"/><circle cx="36" cy="36" r={r} fill="none" stroke={`rgba(${accent},0.90)`} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c-(val/100)*c} transform="rotate(-90 36 36)" style={{filter:`drop-shadow(0 0 5px rgba(${accent},0.6))`}}/><text x="36" y="33" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.40)" fontFamily="'Segoe UI Variable','Segoe UI',system-ui">Progress</text><text x="36" y="45" textAnchor="middle" fontSize="12" fontWeight="700" fill="white" fontFamily="'Segoe UI Variable','Segoe UI',system-ui">{val}%</text></svg>);};

/* ── Neon connector ──────────────────────────────────────── */
const NeonLine = ({delay=0}) => (<div style={{flex:1,height:1,position:'relative',overflow:'hidden',margin:'0 1px',marginBottom:18}}><div style={{position:'absolute',inset:0,background:'rgba(255,255,255,0.08)'}}/><div style={{position:'absolute',top:0,height:'100%',width:'36%',background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.14) 15%,rgba(255,255,255,0.78) 50%,rgba(255,255,255,0.14) 85%,transparent 100%)',boxShadow:'0 0 5px 2px rgba(255,255,255,0.28)',animation:'nsl 2.8s ease-in-out infinite alternate',animationDelay:`${delay}s`}}/></div>);

/* ── IcoBtn — animated honeycomb icon button ─────────────── */
const IcoBtn = ({id, label, icon, sz=50, page, active, setActive, navId}) => {
  const [hov,setHov] = React.useState(false);
  const isActive = active===id;
  const lit = isActive || hov;
  return (
    <div
      onClick={()=>{setActive(isActive?null:id); page(navId||id);}}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,cursor:'pointer',userSelect:'none'}}>
      <div style={{
        width:sz,height:sz,borderRadius:'50%',
        position:'relative',
        display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
        /* glass base */
        background: isActive
          ? 'rgba(255,255,255,0.26)'
          : hov
            ? 'rgba(255,255,255,0.15)'
            : 'rgba(255,255,255,0.07)',
        border: isActive
          ? '2px solid rgba(255,255,255,0.55)'
          : hov
            ? '1.5px solid rgba(255,255,255,0.32)'
            : '1.5px solid rgba(255,255,255,0.14)',
        backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',
        boxShadow: isActive
          ? '0 0 0 4px rgba(255,255,255,0.10), 0 6px 24px rgba(255,255,255,0.18), 0 2px 0 rgba(255,255,255,0.20) inset'
          : hov
            ? '0 0 0 3px rgba(255,255,255,0.07), 0 4px 18px rgba(255,255,255,0.10)'
            : '0 2px 8px rgba(0,0,0,0.14)',
        color: lit ? 'white' : 'rgba(255,255,255,0.62)',
        transform: isActive ? 'scale(1.15) translateY(-3px)' : hov ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
        transition:'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* spinning ring on active */}
        {isActive && (
          <div style={{
            position:'absolute',inset:-4,borderRadius:'50%',
            border:'2px solid transparent',
            borderTopColor:'rgba(255,255,255,0.70)',
            borderRightColor:'rgba(255,255,255,0.25)',
            animation:'spinRing 1.8s linear infinite',
            pointerEvents:'none',
          }}/>
        )}
        {/* pulse ping on hover */}
        {hov && !isActive && (
          <div style={{
            position:'absolute',inset:0,borderRadius:'50%',
            background:'rgba(255,255,255,0.12)',
            animation:'pingPulse 0.8s ease-out forwards',
            pointerEvents:'none',
          }}/>
        )}
        {React.cloneElement(icon,{width:sz>60?24:sz>46?22:18,height:sz>60?24:sz>46?22:18})}
      </div>
      <span style={{
        fontSize:'0.47rem',
        color: isActive ? 'white' : hov ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.46)',
        textAlign:'center',lineHeight:1.3,whiteSpace:'normal',wordBreak:'break-word',
        fontWeight: isActive ? 700 : hov ? 500 : 400,
        transform: lit ? 'translateY(-1px)' : 'translateY(0)',
        transition:'all 0.2s ease',
        maxWidth:sz+14,
      }}>{label}</span>
    </div>
  );
};

/* ── Module button ───────────────────────────────────────── */
const ModBtn = ({mod,active,onClick,sz=48,onNavigate}) => {
  const handleClick = () => { onClick(); if(mod.id!=='showroom') onNavigate(mod.id); };
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,cursor:'pointer',userSelect:'none',flex:1}} onClick={handleClick}>
      <div style={{width:sz,height:sz,borderRadius:'50%',background:active?'rgba(255,255,255,0.22)':'rgba(255,255,255,0.07)',border:`1.5px solid ${active?'rgba(255,255,255,0.42)':'rgba(255,255,255,0.14)'}`,display:'flex',alignItems:'center',justifyContent:'center',color:active?'white':'rgba(255,255,255,0.65)',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',boxShadow:active?'0 3px 16px rgba(255,255,255,0.15),0 1px 0 rgba(255,255,255,0.15) inset':'0 2px 8px rgba(0,0,0,0.12),0 1px 0 rgba(255,255,255,0.06) inset',transition:'all 0.2s ease',flexShrink:0}}>
        {React.cloneElement(mod.icon,{width:sz>44?20:18,height:sz>44?20:18})}
      </div>
      <span style={{fontSize:'0.52rem',color:active?'white':'rgba(255,255,255,0.48)',textAlign:'center',lineHeight:1.25,whiteSpace:'pre-line',fontWeight:active?600:400,transition:'color 0.2s'}}>{mod.label}</span>
    </div>
  );
};

/* ── Module Detail Page (placeholder) ───────────────────── */
const ModulePage = ({modId,onBack,allMods}) => {
  const mod = allMods.find(m=>m.id===modId) || {id:modId,label:modId};
  return (
    <div style={{minHeight:'100vh',fontFamily:"'Segoe UI Variable','Segoe UI',system-ui,sans-serif",color:'white',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
      <div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse at 30% 25%, rgba(40,60,80,0.9) 0%, rgba(10,12,18,0.97) 70%)'}}/>
      <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',backgroundSize:'48px 48px',zIndex:0}}/>
      <div style={{position:'relative',zIndex:2,display:'flex',flexDirection:'column',alignItems:'center',gap:24,padding:40}}>
        <div style={{width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,0.07)',border:'1.5px solid rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(12px)',boxShadow:'0 8px 32px rgba(0,0,0,0.3)'}}>
          {mod.icon ? React.cloneElement(mod.icon,{width:36,height:36,stroke:'rgba(255,255,255,0.8)'}) : <Icon d="M12 2a10 10 0 100 20A10 10 0 0012 2z" size={36} color="rgba(255,255,255,0.7)"/>}
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'2rem',fontWeight:700,letterSpacing:'0.04em',marginBottom:8}}>{(mod.label||'').replace(/\n/,' ')}</div>
          <div style={{fontSize:'0.88rem',color:'rgba(255,255,255,0.38)',marginBottom:32}}>Module • Under Construction</div>
          <div style={{width:320,padding:'32px 40px',background:'rgba(255,255,255,0.04)',border:'1px dashed rgba(255,255,255,0.15)',borderRadius:16,color:'rgba(255,255,255,0.35)',fontSize:'0.82rem',lineHeight:1.7}}>
            🚧 This page is being built.<br/>Content for <strong style={{color:'rgba(255,255,255,0.6)'}}>{(mod.label||'').replace(/\n/,' ')}</strong> will appear here.
          </div>
        </div>
        <button onClick={onBack} style={{marginTop:8,padding:'9px 28px',borderRadius:50,cursor:'pointer',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.20)',color:'white',fontSize:'0.78rem',backdropFilter:'blur(20px) saturate(1.4)',WebkitBackdropFilter:'blur(20px) saturate(1.4)',boxShadow:'0 4px 18px rgba(0,0,0,0.22),0 1px 0 rgba(255,255,255,0.14) inset',transition:'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',letterSpacing:'0.03em'}} onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.18)';e.currentTarget.style.transform='scale(1.05)';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.transform='scale(1)';}}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

/* ── Overall Project Page (placeholder) ─────────────────── */
const OverallProjectPage = ({onBack,accent}) => (
  <div style={{minHeight:'100vh',fontFamily:"'Segoe UI Variable','Segoe UI',system-ui,sans-serif",color:'white',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
    <div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse at 50% 30%, rgba(60,90,50,0.8) 0%, rgba(10,14,10,0.97) 70%)'}}/>
    <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',backgroundSize:'48px 48px',zIndex:0}}/>
    <div style={{position:'relative',zIndex:2,display:'flex',flexDirection:'column',alignItems:'center',gap:28,padding:40}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'2rem',fontWeight:700,letterSpacing:'0.04em',marginBottom:8}}>Overall Project</div>
        <div style={{fontSize:'0.88rem',color:'rgba(255,255,255,0.38)',marginBottom:32}}>Dashboard Analytics • Under Construction</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,maxWidth:520}}>
        {[{l:'Active Projects',v:'17',s:'Running'},{l:'Progress',v:'84%',s:'On track'},{l:'Team Size',v:'142',s:'Deployed'},{l:'Budget Used',v:'67%',s:'Within limits'},{l:'Milestones',v:'24/31',s:'Completed'},{l:'Customer Score',v:'4.8★',s:'Excellent'}].map(({l,v,s},i)=>(
          <div key={i} style={{padding:'18px 16px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:14,textAlign:'center',backdropFilter:'blur(12px)'}}>
            <div style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>{l}</div>
            <div style={{fontSize:'1.55rem',fontWeight:700,color:'white',lineHeight:1}}>{v}</div>
            <div style={{fontSize:'0.60rem',color:`rgba(${accent},0.8)`,marginTop:4}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{width:380,padding:'24px 32px',background:'rgba(255,255,255,0.04)',border:'1px dashed rgba(255,255,255,0.12)',borderRadius:16,color:'rgba(255,255,255,0.30)',fontSize:'0.80rem',textAlign:'center',lineHeight:1.7}}>
        🚧 Detailed project analytics, Gantt charts, and team management features will be added here.
      </div>
      <button onClick={onBack} style={{padding:'9px 28px',borderRadius:50,cursor:'pointer',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.20)',color:'white',fontSize:'0.78rem',backdropFilter:'blur(20px) saturate(1.4)',WebkitBackdropFilter:'blur(20px) saturate(1.4)',boxShadow:'0 4px 18px rgba(0,0,0,0.22),0 1px 0 rgba(255,255,255,0.14) inset',transition:'all 0.22s cubic-bezier(0.34,1.56,0.64,1)'}} onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.18)';e.currentTarget.style.transform='scale(1.05)';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.transform='scale(1)';}}>
        ← Back to Dashboard
      </button>
    </div>
  </div>
);

/* ═══════════════════ MAIN DASHBOARD ════════════════════════ */
export default function Dashboard({onBack}) {
  const [bgIdx,setBgIdx]=useState(0);
  const [activeMod,setAM]=useState(null);
  const [showTuner,setShowTuner]=useState(false);
  const [hue,setHue]=useState(0);
  const [sat,setSat]=useState(100);
  const [bright,setBright]=useState(100);
  const [tintH,setTintH]=useState(0);
  const [tintA,setTintA]=useState(0);
  const [slideIdx,setSlideIdx]=useState(0);
  const [page,setPage]=useState(null);
  const [activeMetric,setActiveMetric]=useState('salesorder');
  const touchX=useRef(null);

  // Auto-advance slides every 4 seconds
  useEffect(()=>{
    const t=setInterval(()=>{
      setSlideIdx(i=>(i+1)%SHOWROOM_SLIDES.length);
    },4000);
    return ()=>clearInterval(t);
  },[]);

  const slide=SHOWROOM_SLIDES[slideIdx];
  const isShowroomTab = bgIdx===0;

  // When on Showroom tab: bg = current slide. Otherwise: bg = selected BACKGROUND.
  const activeBg = isShowroomTab
    ? { url: slide.url, accent: slide.accent, dim: slide.dim }
    : BACKGROUNDS[bgIdx];

  const bg = BACKGROUNDS[bgIdx]; // keep for tab display name
  const bgFilter=`brightness(${activeBg.dim*bright/100}) saturate(${sat/100}) hue-rotate(${hue}deg)`;
  const tintColor = isShowroomTab
    ? slide.tint || `rgba(0,0,0,0)`
    : `hsla(${tintH},70%,50%,${tintA/100})`;

  const allMods=[...ROW1,...ROW2,...ROW3];
  const resetTuner=()=>{setHue(0);setSat(100);setBright(100);setTintH(0);setTintA(0);};

  const SLIDERS=[
    {label:'Hue',val:hue,set:setHue,min:0,max:360,unit:'°',color:'#a78bfa',bg:`linear-gradient(90deg,hsl(0,80%,55%),hsl(60,80%,55%),hsl(120,80%,55%),hsl(180,80%,55%),hsl(240,80%,55%),hsl(300,80%,55%),hsl(360,80%,55%))`},
    {label:'Saturation',val:sat,set:setSat,min:0,max:200,unit:'%',color:'#fb923c',bg:`linear-gradient(90deg,#555,rgba(${activeBg.accent},0.9))`},
    {label:'Brightness',val:bright,set:setBright,min:20,max:180,unit:'%',color:'#fbbf24',bg:'linear-gradient(90deg,#111,#fff)'},
    {label:'Tint Hue',val:tintH,set:setTintH,min:0,max:360,unit:'°',color:`hsl(${tintH},80%,60%)`,bg:`linear-gradient(90deg,hsl(0,70%,50%),hsl(60,70%,50%),hsl(120,70%,50%),hsl(180,70%,50%),hsl(240,70%,50%),hsl(300,70%,50%),hsl(360,70%,50%))`},
    {label:'Tint',val:tintA,set:setTintA,min:0,max:60,unit:'%',color:'#94a3b8',bg:'linear-gradient(90deg,transparent,rgba(100,150,255,0.6))'},
  ];

  // Page routing
  if(page==='overall') return <OverallProjectPage onBack={()=>setPage(null)} accent={activeBg.accent}/>;
  if(page) return <ModulePage modId={page} onBack={()=>setPage(null)} allMods={allMods}/>;

  // Swipe handlers for showroom
  const onTouchStart=(e)=>{touchX.current=e.touches[0].clientX;};
  const onTouchEnd=(e)=>{
    if(touchX.current===null) return;
    const dx=e.changedTouches[0].clientX-touchX.current;
    if(Math.abs(dx)>40){
      if(dx<0) setSlideIdx(i=>(i+1)%SHOWROOM_SLIDES.length);
      else setSlideIdx(i=>(i-1+SHOWROOM_SLIDES.length)%SHOWROOM_SLIDES.length);
    }
    touchX.current=null;
  };

  return (
    <div style={{height:'100vh',width:'100%',overflow:'hidden',fontFamily:"'Segoe UI Variable','Segoe UI',system-ui,sans-serif",position:'relative',color:'white', zIndex: 9999}}>
      <style>{`
        @keyframes nsl{0%{left:-36%}100%{left:100%}}
        @keyframes tunerIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spinRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pingPulse{0%{transform:scale(1);opacity:0.6}100%{transform:scale(1.8);opacity:0}}
        @keyframes stageFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes stageGlow{0%,100%{filter:drop-shadow(0 0 4px rgba(255,255,255,0.15))}50%{filter:drop-shadow(0 0 12px rgba(255,255,255,0.55))}}
        @keyframes stagePulse{0%{opacity:0;transform:scale(0.6)}60%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
        .stage-item{transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1);}
        .stage-item:hover{transform:translateY(-5px) scale(1.12)!important;}
        .stage-item:hover .stage-icon{filter:drop-shadow(0 0 10px rgba(255,255,255,0.70))!important;stroke:white!important;}
        .stage-item:hover .stage-label{color:rgba(255,255,255,0.90)!important;}
        *{box-sizing:border-box;margin:0;padding:0;}
        button,input{font-family:inherit;}
        ::-webkit-scrollbar{width:0;height:0;}
        .tslider{-webkit-appearance:none;appearance:none;width:100%;height:5px;border-radius:5px;outline:none;cursor:pointer;}
        .tslider::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:white;cursor:pointer;border:2.5px solid rgba(0,0,0,0.22);box-shadow:0 1px 8px rgba(0,0,0,0.5);}
        .tslider::-webkit-slider-thumb:hover{transform:scale(1.2);}
        .tslider::-moz-range-thumb{width:15px;height:15px;border-radius:50%;background:white;cursor:pointer;border:2.5px solid rgba(0,0,0,0.22);}
      `}</style>

      {/* Full-page background — black on Showroom tab; image on other tabs */}
      <div style={{position:'fixed',inset:0,zIndex:9990,background:'#000',pointerEvents:'none'}}/>
      {BACKGROUNDS.map((b,i)=>(
        <div key={b.id} style={{position:'fixed',inset:0,zIndex:9990,backgroundImage:`url(${b.url})`,backgroundSize:'cover',backgroundPosition:'center',filter:bgFilter,transition:'opacity 0.8s ease',opacity:!isShowroomTab&&i===bgIdx?1:0,pointerEvents:'none'}}/>
      ))}
      {/* Tint overlay — slide-specific when on Showroom, manual when on other tabs */}
      <div style={{position:'fixed',inset:0,zIndex:9991,background:tintColor,mixBlendMode:'color',pointerEvents:'none',transition:'background 0.8s ease'}}/>
      <div style={{position:'fixed',inset:0,zIndex:9991,background:'linear-gradient(140deg,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.05) 100%)',pointerEvents:'none'}}/>

      <div style={{position:'relative',zIndex:9992,height:'100vh',display:'flex',flexDirection:'column'}}>

        {/* ══ NAVBAR ══ */}
        <nav style={{display:'flex',alignItems:'center',gap:12,padding:'10px 20px',background:'rgba(255,255,255,0.05)',backdropFilter:'blur(24px) saturate(1.3)',WebkitBackdropFilter:'blur(24px) saturate(1.3)',borderBottom:'1px solid rgba(255,255,255,0.08)',flexShrink:0,position:'relative'}}>
          {/* Logo — place your company logo file in /public/logo.png (or .svg/.jpg) */}
          <div style={{display:'flex',alignItems:'center',gap:8,marginRight:4}}>
            <div style={{width:36,height:36,borderRadius:'50%',overflow:'hidden',background:'rgba(255,255,255,0.10)',border:'1.5px solid rgba(255,255,255,0.25)',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(8px)',flexShrink:0}}>
              {/* ↓↓↓ REPLACE src WITH YOUR LOGO PATH e.g. "/logo.png" or "/naffco-logo.svg" ↓↓↓ */}
              <img
                src="/logo.png"
                alt="Company Logo"
                style={{width:'100%',height:'100%',objectFit:'contain'}}
                onError={e=>{
                  e.target.style.display='none';
                  e.target.nextSibling.style.display='flex';
                }}
              />
              {/* Fallback icon shown if logo.png not found */}
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="rgba(255,255,255,0.90)" strokeWidth="1.8" strokeLinecap="round" style={{display:'none'}}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span style={{fontWeight:700,fontSize:'1rem',letterSpacing:'0.02em',whiteSpace:'nowrap',textShadow:'0 1px 8px rgba(0,0,0,0.4)'}}><span style={{color:'#ff2828',textShadow:'0 0 12px rgba(255,40,40,0.55)'}}>NAFFCO</span> AI APEX</span>
          </div>
          {/* Search */}
          <div style={{flex:1,maxWidth:320,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:50,padding:'6px 14px',display:'flex',alignItems:'center',gap:7}}>
            <Icon d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" size={13} color="rgba(255,255,255,0.35)"/>
            <input placeholder="Enter command or search something…" style={{background:'none',border:'none',outline:'none',color:'rgba(255,255,255,0.50)',fontSize:'0.72rem',width:'100%'}}/>
          </div>
          <div style={{flex:1}}/>
          {/* Tune button */}
          <button onClick={()=>setShowTuner(v=>!v)} style={{height:32,padding:'0 14px',borderRadius:50,cursor:'pointer',background:showTuner?'rgba(255,255,255,0.20)':'rgba(255,255,255,0.07)',border:`1px solid ${showTuner?'rgba(255,255,255,0.40)':'rgba(255,255,255,0.15)'}`,display:'flex',alignItems:'center',gap:6,color:showTuner?'white':'rgba(255,255,255,0.65)',backdropFilter:'blur(20px) saturate(1.5)',WebkitBackdropFilter:'blur(20px) saturate(1.5)',boxShadow:showTuner?'0 4px 18px rgba(0,0,0,0.28),0 1px 0 rgba(255,255,255,0.20) inset':'0 2px 10px rgba(0,0,0,0.20),0 1px 0 rgba(255,255,255,0.10) inset',transition:'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',fontSize:'0.68rem',fontWeight:500,whiteSpace:'nowrap'}} onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.16)';e.currentTarget.style.transform='scale(1.05)';}} onMouseLeave={e=>{e.currentTarget.style.background=showTuner?'rgba(255,255,255,0.20)':'rgba(255,255,255,0.07)';e.currentTarget.style.transform='scale(1)';}}>
            <Icon d="M12 3a9 9 0 100 18A9 9 0 0012 3zM12 8v4M12 16h.01M8.5 8a4.5 4.5 0 017 0" size={13} color="currentColor"/>
            Tune
          </button>
          {["M12 2a10 10 0 100 20A10 10 0 0012 2zM12 7v5l3 2","M3 3h18v18H3zM9 9h6M9 12h6M9 15h4","M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"].map((d,i)=>(
            <button key={i} style={{width:36,height:36,borderRadius:'50%',cursor:'pointer',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.14)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.62)',backdropFilter:'blur(20px) saturate(1.4)',WebkitBackdropFilter:'blur(20px) saturate(1.4)',boxShadow:'0 2px 10px rgba(0,0,0,0.20),0 1px 0 rgba(255,255,255,0.10) inset',transition:'all 0.22s cubic-bezier(0.34,1.56,0.64,1)'}} onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.18)';e.currentTarget.style.borderColor='rgba(255,255,255,0.32)';e.currentTarget.style.transform='scale(1.10)';e.currentTarget.style.boxShadow='0 4px 18px rgba(0,0,0,0.28),0 1px 0 rgba(255,255,255,0.18) inset';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.borderColor='rgba(255,255,255,0.14)';e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.20),0 1px 0 rgba(255,255,255,0.10) inset';}}>
              <Icon d={d} size={15} color="currentColor"/>
            </button>
          ))}
          {/* User */}
          <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:50,padding:'4px 12px 4px 4px',cursor:'pointer'}}>
            <div style={{width:28,height:28,borderRadius:'50%',background:'rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Icon d="M12 3a4 4 0 100 8 4 4 0 000-8zM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" size={15} color="rgba(255,255,255,0.70)"/>
            </div>
            <div><div style={{fontSize:'0.75rem',fontWeight:600,lineHeight:1.1}}>Zayad</div><div style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.40)'}}>@username</div></div>
            <Icon d="M6 9l6 6 6-6" size={11} color="rgba(255,255,255,0.35)"/>
          </div>
          <button onClick={onBack} style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.20)',padding:'6px 16px',borderRadius:50,color:'#ffffff',cursor:'pointer',fontSize:'0.72rem',textTransform:'uppercase',letterSpacing:'1px',marginLeft:'5px',backdropFilter:'blur(20px) saturate(1.5)',WebkitBackdropFilter:'blur(20px) saturate(1.5)',boxShadow:'0 2px 12px rgba(0,0,0,0.22),0 1px 0 rgba(255,255,255,0.12) inset',transition:'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',fontWeight:600}} onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,80,80,0.18)';e.currentTarget.style.borderColor='rgba(255,100,100,0.50)';e.currentTarget.style.transform='scale(1.06)';e.currentTarget.style.boxShadow='0 4px 18px rgba(255,60,60,0.22),0 1px 0 rgba(255,255,255,0.18) inset';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.borderColor='rgba(255,255,255,0.20)';e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.22),0 1px 0 rgba(255,255,255,0.12) inset';}}>Exit</button>
        </nav>

        {/* ══ TUNER BAR ══ */}
        {showTuner && (
          <div style={{display:'flex',alignItems:'center',gap:0,background:'rgba(8,8,18,0.70)',backdropFilter:'blur(28px)',WebkitBackdropFilter:'blur(28px)',borderBottom:'1px solid rgba(255,255,255,0.07)',padding:'10px 20px',flexShrink:0,animation:'tunerIn 0.22s ease',overflowX:'auto'}}>
            <div style={{width:38,height:38,borderRadius:9,flexShrink:0,marginRight:16,backgroundImage:`url(${activeBg.url})`,backgroundSize:'cover',backgroundPosition:'center',filter:bgFilter,border:'1px solid rgba(255,255,255,0.15)',boxShadow:'0 2px 10px rgba(0,0,0,0.4)'}}/>
            {SLIDERS.map((s,i)=>(
              <div key={s.label} style={{display:'flex',flexDirection:'column',gap:4,minWidth:120,flex:1,padding:'0 12px',borderLeft:i>0?'1px solid rgba(255,255,255,0.06)':'none'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:5}}><div style={{width:7,height:7,borderRadius:'50%',background:s.color,flexShrink:0}}/><span style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.45)',whiteSpace:'nowrap'}}>{s.label}</span></div>
                  <span style={{fontSize:'0.62rem',fontWeight:700,color:s.color,minWidth:34,textAlign:'right'}}>{s.val}{s.unit}</span>
                </div>
                <input type="range" className="tslider" min={s.min} max={s.max} value={s.val} onChange={e=>s.set(Number(e.target.value))} style={{'--fill':s.color,'--pct':`${((s.val-s.min)/(s.max-s.min))*100}%`,background:s.bg,backgroundSize:`${((s.val-s.min)/(s.max-s.min))*100}% 100%,100% 100%`}}/>
              </div>
            ))}
            {tintA>0&&<div style={{width:26,height:26,borderRadius:7,flexShrink:0,marginLeft:12,background:`hsl(${tintH},72%,52%)`,border:'1px solid rgba(255,255,255,0.18)'}}/>}
            <button onClick={resetTuner} style={{marginLeft:14,flexShrink:0,padding:'5px 12px',borderRadius:7,cursor:'pointer',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',color:'rgba(255,255,255,0.42)',fontSize:'0.62rem',whiteSpace:'nowrap'}} onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.12)';e.currentTarget.style.color='white';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='rgba(255,255,255,0.42)';}}>↺ Reset</button>
          </div>
        )}

        {/* ══ BODY ══ */}
        <div style={{flex:1,display:'grid',gridTemplateColumns:'1fr 310px',gap:13,padding:'13px 18px',alignItems:'stretch'}}>

          {/* ─── LEFT ─── */}
          <div style={{display:'flex',flexDirection:'column',gap:11,overflowY:'auto',minHeight:0}}>

            {/* BG tabs */}
            <div style={{display:'flex',gap:7}}>
              {BACKGROUNDS.map((b,i)=>(
                <button key={b.id} onClick={()=>setBgIdx(i)} style={{
                  padding:'5px 17px',borderRadius:50,cursor:'pointer',
                  background:bgIdx===i?'rgba(255,255,255,0.20)':'rgba(255,255,255,0.06)',
                  border:`1px solid ${bgIdx===i?'rgba(255,255,255,0.42)':'rgba(255,255,255,0.12)'}`,
                  color:bgIdx===i?'white':'rgba(255,255,255,0.50)',
                  fontSize:'0.70rem',fontWeight:bgIdx===i?700:400,
                  backdropFilter:'blur(20px) saturate(1.5)',WebkitBackdropFilter:'blur(20px) saturate(1.5)',
                  boxShadow:bgIdx===i?'0 4px 18px rgba(0,0,0,0.28),0 1.5px 0 rgba(255,255,255,0.22) inset':'0 2px 8px rgba(0,0,0,0.16),0 1px 0 rgba(255,255,255,0.09) inset',
                  transition:'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                  transform:bgIdx===i?'scale(1.04)':'scale(1)',
                }}
                onMouseEnter={e=>{if(bgIdx!==i){e.currentTarget.style.background='rgba(255,255,255,0.13)';e.currentTarget.style.transform='scale(1.04)';e.currentTarget.style.color='rgba(255,255,255,0.80)';}}}
                onMouseLeave={e=>{if(bgIdx!==i){e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.transform='scale(1)';e.currentTarget.style.color='rgba(255,255,255,0.50)';}}}>
                  {b.label}
                </button>
              ))}
            </div>

            {/* ── HERO — swipeable showroom card ── */}
            <Glass style={{overflow:'hidden',padding:0,position:'relative',height:265,cursor:'grab'}}
              onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              {/* background image transitions */}
              {SHOWROOM_SLIDES.map((sl,i)=>(
                <div key={sl.id} style={{position:'absolute',inset:0,backgroundImage:`url(${sl.url})`,backgroundSize:'cover',backgroundPosition:'center',transition:'opacity 0.55s ease',opacity:i===slideIdx?1:0,filter:'brightness(0.72)'}}/>
              ))}
              <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.38) 100%)'}}/>
              {/* slide label pill */}
              <div style={{position:'absolute',top:13,left:'50%',transform:'translateX(-50%)',background:'rgba(255,255,255,0.12)',backdropFilter:'blur(14px)',border:'1px solid rgba(255,255,255,0.20)',borderRadius:50,padding:'5px 22px',fontSize:'0.76rem',fontWeight:500,color:'white',whiteSpace:'nowrap',zIndex:3}}>{slide.label}</div>
              {/* left/right arrows */}
              {[{dir:-1,pos:'left:12px'},{dir:1,pos:'right:12px'}].map(({dir,pos},ai)=>(
                <button key={ai} onClick={()=>setSlideIdx(i=>(i+dir+SHOWROOM_SLIDES.length)%SHOWROOM_SLIDES.length)} style={{position:'absolute',top:'50%',transform:'translateY(-50%)',zIndex:4,[pos.split(':')[0]]:parseInt(pos.split(':')[1]),width:34,height:56,borderRadius:10,background:'rgba(0,0,0,0.32)',border:'1px solid rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',backdropFilter:'blur(8px)',color:'rgba(255,255,255,0.75)',transition:'background 0.15s'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,0.55)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(0,0,0,0.32)'}>
                  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={dir<0?'M15 18l-6-6 6-6':'M9 18l6-6-6-6'}/></svg>
                </button>
              ))}
              {/* dot indicators */}
              <div style={{position:'absolute',bottom:12,left:'50%',transform:'translateX(-50%)',display:'flex',gap:5,zIndex:3}}>
                {SHOWROOM_SLIDES.map((_,i)=>(
                  <div key={i} onClick={()=>setSlideIdx(i)} style={{width:i===slideIdx?18:6,height:6,borderRadius:3,background:i===slideIdx?'rgba(255,255,255,0.90)':'rgba(255,255,255,0.35)',transition:'all 0.3s ease',cursor:'pointer'}}/>
                ))}
              </div>
            </Glass>

            {/* Overall Project + Workflow — single combined strip */}
            <div style={{display:'flex',gap:0,background:'rgba(0,0,0,0.28)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,overflow:'hidden'}}>

              {/* LEFT — Overall Project card */}
              <div style={{flexShrink:0,width:220,padding:'0px 18px',borderRight:'1px solid rgba(255,255,255,0.08)',cursor:'pointer',transition:'background 0.15s'}}
                onClick={()=>setPage('overall')}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <div style={{fontWeight:700,fontSize:'0.76rem',marginBottom:10,color:'white',letterSpacing:'0.02em'}}>Overall Project</div>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{position:'relative',flexShrink:0}}>
                    <CircProg val={84} accent={activeBg.accent}/>
                  </div>
                  <div>
                    <div style={{fontSize:'0.55rem',color:'rgba(255,255,255,0.38)',marginBottom:3,textTransform:'uppercase',letterSpacing:'0.06em'}}>Active Projects</div>
                    <div style={{fontSize:'1.70rem',fontWeight:700,lineHeight:1,color:'white'}}>17</div>
                  </div>
                </div>
              </div>


              {/* RIGHT — 7 stages → all navigate to Overall Project page */}
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',height:'100%',minHeight:100}}>
                {[
                  { label:"Quotation",      d:"M6 4h9l4 4v12a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1zM14 4v4h4M9 11h6M9 14h5" },
                  { label:"Planning",       d:"M3 4h18v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4zM3 9h18M8 2v3M16 2v3M7 13h2v2H7zM15 13h2v2h-2z" },
                  { label:"Drawings",       d:"M3 3h18v18H3zM3 17l5-5 4 4 5-6 5 4" },
                  { label:"Handover",       d:"M5 12h12M12 8l4 4-4 4M19 5v14" },
                  { label:"Dispatch",       d:"M1 10h15v9H1zM16 13l5 2.5V19h-5zM5 20a2 2 0 100-4 2 2 0 000 4zM13 20a2 2 0 100-4 2 2 0 000 4z" },
                  { label:"Completed",      d:"M12 2a10 10 0 100 20A10 10 0 0012 2zM8 12l3 3 5-6" },
                  { label:"Customer Happy", d:"M12 2a10 10 0 100 20A10 10 0 0012 2zM9 10h.01M15 10h.01M8 14.5Q12 18.5 16 14.5" },
                ].map((w,i,arr)=>(
                  <React.Fragment key={i}>
                    {/* stage — all go to overall project */}
                    <div className="stage-item"
                      onClick={()=>setPage('overall')}
                      style={{
                        display:'flex',flexDirection:'column',alignItems:'center',gap:8,
                        cursor:'pointer',userSelect:'none',flexShrink:0,
                        animation:`stagePulse 0.5s ease-out ${i*0.08}s both`,
                      }}>
                      <svg className="stage-icon"
                        viewBox="0 0 24 24" width={30} height={30}
                        fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round"
                        style={{
                          filter:'drop-shadow(0 0 5px rgba(255,255,255,0.18))',
                          transition:'all 0.22s ease',
                          animation:`stageFloat ${2.8+i*0.3}s ease-in-out ${i*0.25}s infinite, stageGlow ${2.8+i*0.3}s ease-in-out ${i*0.25}s infinite`,
                        }}>
                        <path d={w.d}/>
                      </svg>
                      <span className="stage-label" style={{
                        fontSize:'0.47rem',color:'rgba(255,255,255,0.48)',
                        textAlign:'center',lineHeight:1.25,whiteSpace:'nowrap',
                        fontWeight:400,transition:'color 0.22s',
                      }}>{w.label}</span>
                    </div>
                    {/* animated neon connector */}
                    {i<arr.length-1&&(
                      <div style={{flex:1,height:1,background:'rgba(255,255,255,0.07)',position:'relative',overflow:'hidden',minWidth:14,marginBottom:18}}>
                        <div style={{
                          position:'absolute',top:0,left:0,height:'100%',width:'45%',
                          background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.65),transparent)`,
                          animation:`nsl ${1.4+i*0.18}s ease-in-out ${i*0.14}s infinite`,
                        }}/>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* ── ALL STAGES — honeycomb 8-8-8 ── */}
            <Glass style={{padding:'22px 10px 20px'}}>
              <style>{`
                .hive{display:flex;align-items:flex-start;justify-content:center;gap:46px;}
                .hive-half{margin-left:38px;}
              `}</style>

              {/* ROW 1 — 8: Quotation, Costing, Sales, Contracts, Sales Order, Planning, PQ, Project Photos */}
              <div className="hive hive-half" style={{marginBottom:12}}>
                {WORKFLOW.slice(0,8).map(w=>(
                  <IcoBtn key={w.label} id={w.label} label={w.label} sz={56} page={setPage} active={activeMod} setActive={setAM}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={w.d}/></svg>}/>
                ))}
              </div>

              {/* ROW 2 — Samples…Variations, Showroom(photo), Suppliers, Production, Delivery + Dispatch */}
              <div className="hive" style={{margin:'12px 0'}}>
                {/* stages 8–11: Samples, Material Submittal, Shop Drawings, Variations */}
                {WORKFLOW.slice(8,12).map(w=>(
                  <IcoBtn key={w.label} id={w.label} label={w.label} sz={60} page={setPage} active={activeMod} setActive={setAM}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={w.d}/></svg>}/>
                ))}
                {/* Showroom — live rotating photo circle (replaces Dispatch slot) */}
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,cursor:'pointer',userSelect:'none',flexShrink:0}}
                  onClick={()=>setPage('showroom')}>
                  <div style={{width:60,height:60,borderRadius:'50%',overflow:'hidden',border:'2px solid rgba(255,255,255,0.50)',boxShadow:'0 0 0 4px rgba(255,255,255,0.09),0 4px 18px rgba(0,0,0,0.4)',position:'relative',transition:'transform 0.22s cubic-bezier(0.34,1.56,0.64,1)'}}
                    onMouseEnter={e=>e.currentTarget.style.transform='scale(1.10) translateY(-3px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
                    {SHOWROOM_SLIDES.map((sl,i)=>(
                      <div key={sl.id} style={{position:'absolute',inset:0,backgroundImage:`url(${sl.url})`,backgroundSize:'cover',backgroundPosition:'center',transition:'opacity 0.6s',opacity:i===slideIdx?1:0}}/>
                    ))}
                  </div>
                  <span style={{fontSize:'0.47rem',color:'rgba(255,255,255,0.46)',textAlign:'center',lineHeight:1.25,fontWeight:400,whiteSpace:'nowrap'}}>Showroom</span>
                </div>
                {/* stages 13–15: Suppliers, Production, Delivery */}
                {WORKFLOW.slice(13,16).map(w=>(
                  <IcoBtn key={w.label} id={w.label} label={w.label} sz={60} page={setPage} active={activeMod} setActive={setAM}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={w.d}/></svg>}/>
                ))}
                {/* Dispatch — replaces Factory slot at end */}
                <IcoBtn id="dispatch-btn" label="Dispatch" sz={60} page={setPage} active={activeMod} setActive={setAM}
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="9" width="15" height="11" rx="1.5"/><path d="M16 12l5 2.5V20h-5V12z"/><circle cx="5.5" cy="21" r="2"/><circle cx="12.5" cy="21" r="2"/></svg>}/>
              </div>

              {/* ROW 3 — 8: MIR, WIR, Payment Apps, Invoice, Certificates, After Sales, Maintenance, HR */}
              <div className="hive hive-half" style={{marginTop:12}}>
                {WORKFLOW.slice(16).map(w=>(
                  <IcoBtn key={w.label} id={w.label} label={w.label} sz={56} page={setPage} active={activeMod} setActive={setAM}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={w.d}/></svg>}/>
                ))}
              </div>

            </Glass>

          </div>

          {/* ─── RIGHT ─── */}
          <div style={{display:'flex',flexDirection:'column',gap:11,minHeight:0}}>
            {/* Financial Metrics / YTD */}
            <Glass style={{padding:'14px 14px 10px',backdropFilter:'blur(28px) saturate(1.6)',WebkitBackdropFilter:'blur(28px) saturate(1.6)',background:'rgba(255,255,255,0.055)',boxShadow:'0 8px 32px rgba(0,0,0,0.28),0 1.5px 0 rgba(255,255,255,0.13) inset'}}>
              <div style={{fontWeight:700,fontSize:'0.82rem',marginBottom:10,color:'rgba(255,255,255,0.82)',letterSpacing:'0.02em'}}>Year to Date <span style={{color:'rgba(255,255,255,0.42)',fontWeight:500}}>(YTD)</span></div>
              <div style={{display:'flex',flexDirection:'column',gap:7}}>
                {FIN_METRICS.map((m)=>{
                  const isActive = activeMetric===m.id;
                  return(
                  <div key={m.id} onClick={()=>setActiveMetric(m.id)}
                    style={{display:'flex',alignItems:'center',gap:12,padding:'11px 13px',borderRadius:14,
                      background:isActive?`rgba(${m.color},0.13)`:'rgba(255,255,255,0.05)',
                      border:`1px solid ${isActive?`rgba(${m.color},0.40)`:'rgba(255,255,255,0.09)'}`,
                      backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',
                      boxShadow:isActive?`0 4px 20px rgba(${m.color},0.20),0 1px 0 rgba(255,255,255,0.14) inset`:'0 2px 8px rgba(0,0,0,0.14),0 1px 0 rgba(255,255,255,0.07) inset',
                      cursor:'pointer',transition:'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                      transform:isActive?'scale(1.01)':'scale(1)'}}
                    onMouseEnter={e=>{e.currentTarget.style.background=isActive?`rgba(${m.color},0.20)`:'rgba(255,255,255,0.10)';e.currentTarget.style.transform='scale(1.015)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=isActive?`rgba(${m.color},0.13)`:'rgba(255,255,255,0.05)';e.currentTarget.style.transform=isActive?'scale(1.01)':'scale(1)';}}>
                    <div style={{width:38,height:38,borderRadius:'50%',flexShrink:0,
                      background:isActive?`rgba(${m.color},0.22)`:'rgba(255,255,255,0.08)',
                      border:`1.5px solid ${isActive?`rgba(${m.color},0.55)`:'rgba(255,255,255,0.14)'}`,
                      backdropFilter:'blur(10px)',
                      boxShadow:isActive?`0 0 14px rgba(${m.color},0.35)`:'none',
                      display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <Icon d={m.iconD} size={17} color={isActive?`rgba(${m.color},1)`:'rgba(255,255,255,0.52)'}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'0.82rem',color:isActive?`rgba(${m.color},1)`:'rgba(255,255,255,0.78)',fontWeight:isActive?700:500,letterSpacing:'0.01em'}}>{m.label}</div>
                      <div style={{fontSize:'0.60rem',color:'rgba(255,255,255,0.30)',marginTop:2}}>{isActive?'Chart active':'Click to view'}</div>
                    </div>
                    <div style={{fontSize:'1.0rem',fontWeight:700,color:isActive?`rgba(${m.color},1)`:'white',letterSpacing:'-0.01em'}}>{m.value}</div>
                    {isActive&&<div style={{width:6,height:6,borderRadius:'50%',background:`rgba(${m.color},1)`,boxShadow:`0 0 8px rgba(${m.color},0.9)`,flexShrink:0}}/>}
                  </div>
                );})}
              </div>
            </Glass>

            {/* Overall Project Dashboard button */}
            <button
              onClick={()=>setPage('overall')}
              style={{
                width:'100%',padding:'12px 16px',borderRadius:16,cursor:'pointer',
                background:'rgba(255,255,255,0.07)',
                border:'1px solid rgba(255,255,255,0.16)',
                backdropFilter:'blur(28px) saturate(1.5)',WebkitBackdropFilter:'blur(28px) saturate(1.5)',
                display:'flex',alignItems:'center',justifyContent:'space-between',
                color:'white',transition:'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow:'0 8px 28px rgba(0,0,0,0.22),0 1.5px 0 rgba(255,255,255,0.14) inset',
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.15)';e.currentTarget.style.borderColor='rgba(255,255,255,0.32)';e.currentTarget.style.transform='scale(1.015)';e.currentTarget.style.boxShadow='0 12px 36px rgba(0,0,0,0.30),0 1.5px 0 rgba(255,255,255,0.20) inset';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.borderColor='rgba(255,255,255,0.16)';e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.22),0 1.5px 0 rgba(255,255,255,0.14) inset';}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:`rgba(${activeBg.accent},0.18)`,border:`1px solid rgba(${activeBg.accent},0.38)`,backdropFilter:'blur(10px)',boxShadow:`0 0 12px rgba(${activeBg.accent},0.22)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke={`rgba(${activeBg.accent},1)`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
                  </svg>
                </div>
                <div style={{textAlign:'left'}}>
                  <div style={{fontSize:'0.72rem',fontWeight:700,color:'white',lineHeight:1.2}}>Overall Project Dashboard</div>
                  <div style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.40)',marginTop:1}}>View full project analytics</div>
                </div>
              </div>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>

            {/* Chart — no title, fills remaining height */}
            {(()=>{const m=FIN_METRICS.find(x=>x.id===activeMetric)||FIN_METRICS[0];return(
            <Glass style={{flex:1,minHeight:0,padding:'12px 10px 8px',display:'flex',flexDirection:'column',backdropFilter:'blur(28px) saturate(1.6)',WebkitBackdropFilter:'blur(28px) saturate(1.6)',background:'rgba(255,255,255,0.055)',boxShadow:'0 8px 32px rgba(0,0,0,0.28),0 1.5px 0 rgba(255,255,255,0.13) inset'}}>
              <div style={{flex:1,minHeight:0,display:'flex',alignItems:'stretch'}}>
                <SparklineOnly pts={m.pts} bars={m.bars} accent={m.color} fill/>
              </div>
            </Glass>
            );})()}
          </div>
        </div>
      </div>
    </div>
  );
}