import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { findEmployeeByCode } from '../utils/authEmployees.js';

/* ── Responsive window-width hook ── */
function useWindowSize() {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1440);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}

/* ── Compute all layout constants from viewport width ── */
function getLayout(vw) {
  // xs <480 | sm 480-767 | md 768-1023 | lg 1024-1439 | xl ≥1440
  // cardLeft: % from left where active card sits
  // expandX: translateX to centre the expanded card (positive = right)
  if (vw < 480) return {
    RADIUS:480,  PW:148, PH:240, STAGE_H:280,
    stageTop:100, cardBottom:60, cardLeft:'5%',
    expandW:Math.min(vw - 16, 340), expandH:230, expandX:0,
    titleMarginTop:50, logoH:22,
    brandTop:12, brandLeft:10, navLeft:8,
    arBottom:12, arRight:12,
  };
  if (vw < 768) return {
    RADIUS:640,  PW:178, PH:290, STAGE_H:350,
    stageTop:130, cardBottom:85, cardLeft:'6%',
    expandW:Math.min(vw - 32, 460), expandH:290, expandX:40,
    titleMarginTop:75, logoH:26,
    brandTop:14, brandLeft:14, navLeft:12,
    arBottom:14, arRight:14,
  };
  if (vw < 1024) return {
    RADIUS:800,  PW:210, PH:340, STAGE_H:420,
    stageTop:155, cardBottom:105, cardLeft:'8%',
    expandW:600, expandH:350, expandX:70,
    titleMarginTop:100, logoH:28,
    brandTop:18, brandLeft:18, navLeft:16,
    arBottom:18, arRight:18,
  };
  if (vw < 1440) return {
    RADIUS:960,  PW:238, PH:390, STAGE_H:500,
    stageTop:168, cardBottom:126, cardLeft:'9%',
    expandW:714, expandH:416, expandX:130,
    titleMarginTop:122, logoH:30,
    brandTop:20, brandLeft:28, navLeft:20,
    arBottom:20, arRight:20,
  };
  return {
    RADIUS:1100, PW:260, PH:420, STAGE_H:550,
    stageTop:180, cardBottom:140, cardLeft:'10%',
    expandW:800, expandH:450, expandX:200,
    titleMarginTop:140, logoH:32,
    brandTop:22, brandLeft:36, navLeft:22,
    arBottom:24, arRight:24,
  };
}
 
// Floating icons per department — each entry: { x%, y%, sz, delay, dur, path }
const FLOATS = {
  sales: [
    { x:12, y:18, sz:36, delay:0,    dur:3.4, d:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    { x:68, y:12, sz:30, delay:0.6,  dur:4.1, d:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
    { x:80, y:48, sz:28, delay:1.1,  dur:3.7, d:'M22 12h-4l-3 9L9 3l-3 9H2' },
    { x:35, y:62, sz:32, delay:0.4,  dur:4.3, d:'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
    { x:55, y:35, sz:26, delay:1.5,  dur:3.2, d:'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
    { x:20, y:75, sz:34, delay:0.9,  dur:3.9, d:'M18 20V10M12 20V4M6 20v-6' },
  ],
  estimation: [
    { x:15, y:20, sz:34, delay:0,    dur:3.6, d:'M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M18 2h4v4M12 12l10-10' },
    { x:70, y:10, sz:28, delay:0.7,  dur:4.0, d:'M4 2v20l8-5 8 5V2z' },
    { x:82, y:52, sz:30, delay:1.2,  dur:3.5, d:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    { x:30, y:65, sz:26, delay:0.3,  dur:4.2, d:'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
    { x:58, y:38, sz:32, delay:1.6,  dur:3.3, d:'M3 3h18v4H3zM3 11h18v4H3zM3 19h18v4H3z' },
    { x:22, y:80, sz:36, delay:0.8,  dur:3.8, d:'M18 20V10M12 20V4M6 20v-6' },
  ],
  contracts: [
    { x:14, y:22, sz:32, delay:0,    dur:3.5, d:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
    { x:72, y:14, sz:28, delay:0.5,  dur:4.1, d:'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z' },
    { x:80, y:55, sz:30, delay:1.0,  dur:3.6, d:'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3' },
    { x:28, y:68, sz:26, delay:0.4,  dur:4.4, d:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { x:52, y:35, sz:34, delay:1.4,  dur:3.2, d:'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' },
    { x:18, y:82, sz:28, delay:0.9,  dur:3.9, d:'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
  ],
  engineering: [
    { x:10, y:18, sz:34, delay:0,    dur:3.8, d:'M12 15a3 3 0 100-6 3 3 0 000 6zM19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14' },
    { x:74, y:12, sz:28, delay:0.6,  dur:4.0, d:'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z' },
    { x:82, y:50, sz:32, delay:1.1,  dur:3.4, d:'M2 20h20M4 14v6M8 10v10M12 4v16M16 10v10M20 14v6' },
    { x:32, y:64, sz:26, delay:0.3,  dur:4.3, d:'M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9zM13 2v7h7' },
    { x:55, y:32, sz:30, delay:1.5,  dur:3.6, d:'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18' },
    { x:20, y:78, sz:36, delay:0.8,  dur:3.7, d:'M12 2a10 10 0 100 20A10 10 0 0012 2zM12 8v4l3 3' },
  ],
  salesorder: [
    { x:12, y:20, sz:32, delay:0,    dur:3.5, d:'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0' },
    { x:70, y:10, sz:28, delay:0.5,  dur:4.2, d:'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01' },
    { x:80, y:52, sz:30, delay:1.0,  dur:3.7, d:'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3' },
    { x:30, y:66, sz:26, delay:0.4,  dur:4.1, d:'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
    { x:54, y:36, sz:34, delay:1.4,  dur:3.3, d:'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
    { x:22, y:80, sz:28, delay:0.9,  dur:4.0, d:'M5 12H3l9-9 9 9h-2M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
  ],
  supplier: [
    { x:10, y:16, sz:34, delay:0,    dur:3.6, d:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
    { x:72, y:12, sz:28, delay:0.6,  dur:4.1, d:'M1 3h15v13H1zM16 8h4l3 5v3h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' },
    { x:82, y:54, sz:30, delay:1.1,  dur:3.5, d:'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 10a1 1 0 110-2 1 1 0 010 2z' },
    { x:32, y:66, sz:26, delay:0.3,  dur:4.3, d:'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
    { x:55, y:36, sz:32, delay:1.5,  dur:3.2, d:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { x:18, y:80, sz:36, delay:0.8,  dur:3.9, d:'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' },
  ],
};
 
const DEPT_META = {
  sales: {
    desc: 'Sales Intelligence Module',
    definition: 'Empowering NAFFCO\'s sales teams with AI-driven pipeline visibility, intelligent lead scoring, and real-time CRM analytics — transforming raw data into revenue. Forecast demand, identify high-value opportunities, and close deals faster with actionable insights at every stage of the customer journey.',
    stats: [
      { d:'M18 20V10M12 20V4M6 20v-6', v:'1.2M' },
      { d:'M23 6l-9.5 9.5-5-5L1 18', v:'+24%' },
      { d:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z', v:'342' },
      { d:'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', v:'18' },
    ],
    items: ['Pipeline Mgmt','Lead Scoring','CRM Analytics','Forecasting','Reporting'],
  },
  estimation: {
    desc: 'Precision Estimation Engine',
    definition: 'Hello! I am APEX-777, the Lead Architect of AI Estimation.\nWelcome to my studio.',
    stats: [
      { d:'M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M18 2h4v4M12 12l10-10', v:'89' },
      { d:'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3', v:'96%' },
      { d:'M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM12 6v6l4 2', v:'2.4d' },
      { d:'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', v:'4.2M' },
    ],
    items: ['Qty Takeoff','BOQ Builder','Pricing Engine','Tendering','Scope Review'],
  },
  contracts: {
    desc: 'Smart Contract Platform',
    definition: 'End-to-end contract lifecycle management — from AI-assisted drafting and legal review to secure e-signing and compliance tracking. Every agreement is version-controlled, auditable, and archived with full traceability, ensuring NAFFCO\'s commitments are protected at every milestone.',
    stats: [
      { d:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6', v:'24' },
      { d:'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3', v:'142' },
      { d:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', v:'98%' },
      { d:'M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM12 6v6l4 2', v:'6' },
    ],
    items: ['Drafting','Legal Review','E-Signing','Compliance','Archive'],
  },
  engineering: {
    desc: 'Technical Engineering Hub',
    definition: 'A centralised intelligence platform for NAFFCO\'s engineering teams — managing CAD designs, BIM models, fire suppression systems, and commissioning workflows in one place. Built for precision: every technical deliverable is tracked, reviewed, and quality-assured before reaching the field.',
    stats: [
      { d:'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z', v:'12' },
      { d:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z', v:'48' },
      { d:'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z', v:'7' },
      { d:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', v:'4.9' },
    ],
    items: ['CAD Design','BIM Modeling','Fire Systems','Commissioning','QA Testing'],
  },
  salesorder: {
    desc: 'Order Processing System',
    definition: 'Streamline the full order lifecycle — from initial capture and automated invoicing to real-time delivery tracking and returns processing. Multi-level approval flows ensure every sales order is validated, dispatched, and reconciled with full financial visibility across all NAFFCO operations.',
    stats: [
      { d:'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18', v:'156' },
      { d:'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', v:'8.4M' },
      { d:'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3', v:'89%' },
      { d:'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', v:'12' },
    ],
    items: ['Order Capture','Invoicing','Delivery Track','Returns','Approval Flow'],
  },
  supplier: {
    desc: 'Vendor Management Suite',
    definition: 'Comprehensive supplier intelligence — source and onboard vendors, conduct structured evaluations, manage purchase orders, and enforce quality compliance. Track supplier performance over time with AI-generated scorecards, ensuring NAFFCO\'s supply chain remains resilient, reliable, and cost-efficient.',
    stats: [
      { d:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z', v:'34' },
      { d:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', v:'4.8' },
      { d:'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z', v:'289' },
      { d:'M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10', v:'18' },
    ],
    items: ['Sourcing','Vendor Eval','Purchase Orders','QA Check','Performance'],
  },
};
 
const DEPT_ICONS_LARGE = {
  sales: (a) => (
    <svg width="118" height="96" viewBox="0 0 118 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="4" y1="90" x2="114" y2="90" stroke={`rgba(${a},0.18)`} strokeWidth="1"/>
      {[{x:6,h:30,d:'0s'},{x:28,h:52,d:'0.18s'},{x:50,h:70,d:'0.36s'},{x:72,h:44,d:'0.54s'},{x:94,h:80,d:'0.72s'}].map((b,i)=>(
        <g key={i} style={{ transformOrigin:`${b.x+9}px 90px`, animation:`hs-bar-grow 2.2s ease-in-out ${b.d} infinite alternate` }}>
          <rect x={b.x} y={90-b.h} width="18" height={b.h} rx="3" fill={`rgba(${a},0.52)`}/>
        </g>
      ))}// Example from the existing code
<g style={{ transformOrigin:'50px 53px', animation:'hs-ping 3s ease-in-out 1.2s infinite' }}>
  <circle cx="50" cy="53" r="24" stroke={`rgba(${a},0.14)`} strokeWidth="1" fill="none"/>
</g>
      <polyline points="15,67 37,46 59,27 81,52 103,14"
        stroke={`rgba(${a},0.92)`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="220" style={{ animation:'hs-stroke 2.4s ease forwards' }}/>
      {[[15,67],[37,46],[59,27],[81,52],[103,14]].map(([x,y],i)=>(
        <g key={i} style={{ transformOrigin:`${x}px ${y}px`, animation:`hs-ping 2.4s ease-in-out ${i*0.3}s infinite` }}>
          <circle cx={x} cy={y} r="4.5" fill={`rgba(${a},0.95)`}/>
        </g>
      ))}
    </svg>
  ),
  estimation: (a) => (
    <svg width="108" height="108" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="16" height="20" rx="2" stroke={`rgba(${a},0.90)`} strokeWidth="1.5" fill={`rgba(${a},0.08)`}/>
      <line x1="8" y1="7" x2="16" y2="7" stroke={`rgba(${a},0.80)`} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="8" y1="11" x2="14" y2="11" stroke={`rgba(${a},0.80)`} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="8" y1="15" x2="11" y2="15" stroke={`rgba(${a},0.80)`} strokeWidth="1.4" strokeLinecap="round"/>
      <polyline points="13,15 15,17 19,12" stroke={`rgba(${a},1)`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  contracts: (a) => (
    <svg width="100" height="106" viewBox="0 0 100 106" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 7 L89 24 L89 57 C89 79 50 99 50 99 C50 99 11 79 11 57 L11 24 Z"
        stroke={`rgba(${a},0.50)`} strokeWidth="1.8" fill={`rgba(${a},0.06)`}/>
      <path d="M50 18 L78 31 L78 57 C78 72 50 86 50 86 C50 86 22 72 22 57 L22 31 Z"
        stroke={`rgba(${a},0.18)`} strokeWidth="1" fill="none"/>
      <polyline points="31,53 44,67 69,38"
        stroke={`rgba(${a},1)`} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        strokeDasharray="75" strokeDashoffset="75"
        style={{ animation:'hs-stroke 1s ease 0.5s forwards' }}/>
      <g style={{ transformOrigin:'50px 53px', animation:'hs-ping 3s ease-in-out 1.2s infinite' }}>
        <circle cx="50" cy="53" r="24" stroke={`rgba(${a},0.14)`} strokeWidth="1" fill="none"/>
      </g>
    </svg>
  ),
  engineering: (a) => (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g style={{ transformOrigin:'56px 60px', animation:'hs-spin 10s linear infinite' }}>
        <circle cx="56" cy="60" r="28" stroke={`rgba(${a},0.48)`} strokeWidth="2" fill={`rgba(${a},0.05)`}/>
        {[0,45,90,135,180,225,270,315].map((deg,i)=>{
          const r=deg*Math.PI/180;
          return <line key={i}
            x1={(56+27*Math.cos(r)).toFixed(1)} y1={(60+27*Math.sin(r)).toFixed(1)}
            x2={(56+37*Math.cos(r)).toFixed(1)} y2={(60+37*Math.sin(r)).toFixed(1)}
            stroke={`rgba(${a},0.65)`} strokeWidth="5.5" strokeLinecap="round"/>;
        })}
        <circle cx="56" cy="60" r="12" stroke={`rgba(${a},0.38)`} strokeWidth="1.8" fill={`rgba(${a},0.09)`}/>
        <circle cx="56" cy="60" r="5" fill={`rgba(${a},0.85)`}/>
      </g>
      <g style={{ transformOrigin:'90px 26px', animation:'hs-spin-rev 5s linear infinite' }}>
        <circle cx="90" cy="26" r="14" stroke={`rgba(${a},0.32)`} strokeWidth="1.5" fill={`rgba(${a},0.04)`}/>
        {[0,60,120,180,240,300].map((deg,i)=>{
          const r=deg*Math.PI/180;
          return <line key={i}
            x1={(90+13*Math.cos(r)).toFixed(1)} y1={(26+13*Math.sin(r)).toFixed(1)}
            x2={(90+19*Math.cos(r)).toFixed(1)} y2={(26+19*Math.sin(r)).toFixed(1)}
            stroke={`rgba(${a},0.42)`} strokeWidth="4" strokeLinecap="round"/>;
        })}
        <circle cx="90" cy="26" r="5" fill={`rgba(${a},0.60)`}/>
      </g>
    </svg>
  ),
  salesorder: (a) => (
    <svg width="112" height="104" viewBox="0 0 112 104" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g style={{ animation:'hs-float-up 2.2s ease-in-out infinite' }}>
        <line x1="34" y1="40" x2="34" y2="18" stroke={`rgba(${a},0.82)`} strokeWidth="2.2" strokeLinecap="round"/>
        <polyline points="26,28 34,18 42,28" stroke={`rgba(${a},0.82)`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="78" y1="38" x2="78" y2="16" stroke={`rgba(${a},0.60)`} strokeWidth="1.8" strokeLinecap="round"/>
        <polyline points="71,25 78,16 85,25" stroke={`rgba(${a},0.60)`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </g>
      <rect x="18" y="50" width="76" height="50" rx="5" stroke={`rgba(${a},0.52)`} strokeWidth="1.8" fill={`rgba(${a},0.07)`}/>
      <polyline points="18,50 56,67 94,50" stroke={`rgba(${a},0.52)`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="56" y1="50" x2="56" y2="67" stroke={`rgba(${a},0.35)`} strokeWidth="1.5"/>
      <rect x="30" y="72" width="52" height="16" rx="3" fill={`rgba(${a},0.14)`} stroke={`rgba(${a},0.28)`} strokeWidth="1"/>
      <line x1="36" y1="80" x2="68" y2="80" stroke={`rgba(${a},0.45)`} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  supplier: (a) => (
    <svg width="112" height="108" viewBox="0 0 112 108" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="56" y1="22" x2="18" y2="60" stroke={`rgba(${a},0.22)`} strokeWidth="1.5"/>
      <line x1="56" y1="22" x2="94" y2="60" stroke={`rgba(${a},0.22)`} strokeWidth="1.5"/>
      <line x1="18" y1="60" x2="40" y2="92" stroke={`rgba(${a},0.18)`} strokeWidth="1.5"/>
      <line x1="94" y1="60" x2="72" y2="92" stroke={`rgba(${a},0.18)`} strokeWidth="1.5"/>
      <line x1="18" y1="60" x2="94" y2="60" stroke={`rgba(${a},0.12)`} strokeWidth="1"/>
      {[{cx:56,cy:22,r:14,d:'0s'},{cx:18,cy:60,r:11,d:'0.5s'},{cx:94,cy:60,r:11,d:'1.0s'},{cx:40,cy:92,r:9,d:'1.5s'},{cx:72,cy:92,r:9,d:'2.0s'}].map((n,i)=>(
        <g key={i} style={{ transformOrigin:`${n.cx}px ${n.cy}px`, animation:`hs-ping 2.6s ease-in-out ${n.d} infinite` }}>
          <circle cx={n.cx} cy={n.cy} r={n.r} fill={`rgba(${a},0.12)`} stroke={`rgba(${a},0.48)`} strokeWidth="1.5"/>
          <circle cx={n.cx} cy={n.cy} r={i===0?5.5:4} fill={`rgba(${a},${i===0?0.90:0.65})`}/>
        </g>
      ))}
    </svg>
  ),
};
 
const VSCREENS = [
  { title:'PIPELINE',    color:'#00e5ff', a:'0,229,255',   graph:'bar',     x:'55%', y:'18%', dur:'20s', delay:'0s'  },
  { title:'PERFORMANCE', color:'#34d399', a:'52,211,153',  graph:'line',    x:'60%', y:'41%', dur:'20s', delay:'4s'  },
  { title:'COMPLETION',  color:'#a855f7', a:'168,85,247',  graph:'donut',   x:'57%', y:'63%', dur:'20s', delay:'8s'  },
  { title:'ACTIVITY',    color:'#fb923c', a:'251,146,60',  graph:'scatter', x:'7%',  y:'36%', dur:'20s', delay:'12s' },
  { title:'CAPACITY',    color:'#f59e0b', a:'245,158,11',  graph:'gauge',   x:'43%', y:'8%',  dur:'20s', delay:'16s' },
];

/* ─────────────────────────────────────────────
   MINI GRAPH — different chart per department
   All in "nav blue"  rgba(0,170,255,...)
───────────────────────────────────────────── */
function MiniGraph({ deptId }) {
  const ca = (a) => `rgba(0,170,255,${a})`;

  /* ── Sales: modern smooth area chart ── */
  if (deptId === 'sales') return (
    <svg width="100%" height="64" viewBox="0 0 88 64">
      <defs>
        <linearGradient id="sg-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(0,170,255,0.32)"/>
          <stop offset="80%"  stopColor="rgba(0,170,255,0.04)"/>
          <stop offset="100%" stopColor="rgba(0,170,255,0)"/>
        </linearGradient>
        <linearGradient id="sg-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(0,170,255,0.60)"/>
          <stop offset="60%"  stopColor="rgba(0,170,255,0.95)"/>
          <stop offset="100%" stopColor="rgba(130,210,255,1)"/>
        </linearGradient>
      </defs>

      {/* Subtle horizontal grid */}
      {[20,38,56].map((y,i) => (
        <line key={i} x1="4" y1={y} x2="84" y2={y}
          stroke="rgba(200,225,255,0.07)" strokeWidth="0.6" strokeDasharray="3 6"/>
      ))}
      {/* Baseline */}
      <line x1="4" y1="59" x2="84" y2="59" stroke="rgba(200,225,255,0.15)" strokeWidth="0.8"/>

      {/* Gradient area fill */}
      <path d="M4,54 C10,46 15,30 24,26 C31,22 36,38 44,32 C52,26 56,13 64,9 C70,6 76,15 84,11 L84,59 L4,59 Z"
        fill="url(#sg-area)"/>

      {/* Soft glow beneath the line */}
      <path d="M4,54 C10,46 15,30 24,26 C31,22 36,38 44,32 C52,26 56,13 64,9 C70,6 76,15 84,11"
        stroke="rgba(0,170,255,0.16)" strokeWidth="9" fill="none" strokeLinecap="round"/>

      {/* Main smooth curve — animated draw */}
      <path d="M4,54 C10,46 15,30 24,26 C31,22 36,38 44,32 C52,26 56,13 64,9 C70,6 76,15 84,11"
        stroke="url(#sg-line)" strokeWidth="2" fill="none" strokeLinecap="round"
        strokeDasharray="300" strokeDashoffset="300"
        style={{animation:'hs-stroke 2s ease forwards'}}/>

      {/* Data-point rings + dots */}
      {[[4,54],[24,26],[44,32],[64,9],[84,11]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill="rgba(0,170,255,0.09)"/>
          <circle cx={x} cy={y} r="2.2" fill="rgba(0,170,255,0.92)"
            style={{transformOrigin:`${x}px ${y}px`, animation:`hs-ping 2.8s ease-in-out ${(i*0.40).toFixed(2)}s infinite`}}/>
        </g>
      ))}

      {/* Trend badge — top right */}
      <rect x="61" y="1" width="26" height="9" rx="2.5"
        fill="rgba(52,211,153,0.16)" stroke="rgba(52,211,153,0.28)" strokeWidth="0.5"/>
      <text x="74" y="7.8" textAnchor="middle" fill="rgba(52,211,153,0.90)"
        fontSize="5.2" fontWeight="700" fontFamily="Inter,sans-serif">▲ +24%</text>
    </svg>
  );

  /* ── Estimation: document + animated checkmarks ── */
  if (deptId === 'estimation') return (
    <svg width="100%" height="64" viewBox="0 0 88 64">
      <rect x="22" y="3" width="44" height="58" rx="3" stroke={ca(0.28)} strokeWidth="1" fill={ca(0.05)}/>
      {[13,22,31,40,49].map((y,i) => (
        <line key={i} x1="30" y1={y} x2={i<4?60:48} y2={y} stroke={ca(i<4?0.50:0.20)} strokeWidth="1.5" strokeLinecap="round"/>
      ))}
      {[0,1,2,3].map(i => (
        <g key={i} style={{transformOrigin:`17px ${13+i*9}px`, animation:`hs-ping 2.4s ease-in-out ${(i*0.38).toFixed(2)}s infinite`}}>
          <circle cx="17" cy={13+i*9} r="3.5" fill={ca(i<3?0.75:0.30)}/>
          {i < 3 && <path d={`M15.2,${13+i*9} L16.8,${14.6+i*9} L19,${11.4+i*9}`} stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>}
        </g>
      ))}
    </svg>
  );

  /* ── Contracts: donut, ccy=32 (vertically centred in 64) ── */
  if (deptId === 'contracts') {
    const r=18, ccx=26, ccy=32, circ=2*Math.PI*r;
    return (
      <svg width="100%" height="64" viewBox="0 0 88 64">
        <circle cx={ccx} cy={ccy} r={r} fill="none" stroke={ca(0.10)} strokeWidth="7"/>
        {[[0.65,0,0.55],[0.22,0.65,0.38],[0.13,0.87,0.22]].map(([pct,off,a],i) => (
          <circle key={i} cx={ccx} cy={ccy} r={r} fill="none" stroke={ca(a)} strokeWidth="7"
            strokeDasharray={`${(pct*circ).toFixed(1)} ${circ.toFixed(1)}`}
            strokeDashoffset={`${-(off*circ).toFixed(1)}`}
            style={{transform:`rotate(-90deg)`,transformOrigin:`${ccx}px ${ccy}px`}}/>
        ))}
        <text x={ccx} y={ccy+3} textAnchor="middle" fill={ca(0.92)} fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif">98%</text>
        {[['65%','Active',0.55],['22%','Pend.',0.38],['13%','Draft',0.22]].map(([v,l,a],i) => (
          <g key={i}>
            <rect x="52" y={14+i*14} width="5" height="5" rx="1.5" fill={ca(a)}/>
            <text x="59" y={20+i*14} fill={ca(0.70)} fontSize="6" fontFamily="Inter,sans-serif">{v} {l}</text>
          </g>
        ))}
      </svg>
    );
  }

  /* ── Engineering: spinning gear, centred at 32 ── */
  if (deptId === 'engineering') return (
    <svg width="100%" height="64" viewBox="0 0 88 64">
      <g style={{transformOrigin:'26px 32px', animation:'hs-spin 8s linear infinite'}}>
        <circle cx="26" cy="32" r="15" stroke={ca(0.28)} strokeWidth="1.5" fill={ca(0.05)}/>
        {[0,45,90,135,180,225,270,315].map((deg,i) => {
          const rad = deg * Math.PI / 180;
          return <line key={i}
            x1={(26+14*Math.cos(rad)).toFixed(1)} y1={(32+14*Math.sin(rad)).toFixed(1)}
            x2={(26+20*Math.cos(rad)).toFixed(1)} y2={(32+20*Math.sin(rad)).toFixed(1)}
            stroke={ca(0.60)} strokeWidth="4" strokeLinecap="round"/>;
        })}
        <circle cx="26" cy="32" r="5.5" stroke={ca(0.35)} strokeWidth="1.2" fill={ca(0.12)}/>
        <circle cx="26" cy="32" r="2.5" fill={ca(0.85)}/>
      </g>
      {[['12','Projects'],['48','Engineers'],['4.9','Rating']].map(([v,l],i) => (
        <g key={i}>
          <text x="54" y={16+i*15} fill={ca(0.90)} fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif">{v}</text>
          <text x="54" y={24+i*15} fill={ca(0.45)} fontSize="5.5" fontFamily="Inter,sans-serif">{l}</text>
        </g>
      ))}
    </svg>
  );

  /* ── Sales Order: area chart, baseline y=60 ── */
  if (deptId === 'salesorder') return (
    <svg width="100%" height="64" viewBox="0 0 88 64" preserveAspectRatio="none">
      <polygon points="4,60 16,48 28,40 40,46 52,26 64,34 76,14 76,60 4,60" fill={ca(0.12)}/>
      <polyline points="4,60 16,48 28,40 40,46 52,26 64,34 76,14"
        stroke={ca(0.90)} strokeWidth="1.8" fill="none" strokeLinecap="round"
        strokeDasharray="300" strokeDashoffset="300" style={{animation:'hs-stroke 2.2s ease forwards'}}/>
      {[{x:4,y:60},{x:16,y:48},{x:28,y:40},{x:40,y:46},{x:52,y:26},{x:64,y:34},{x:76,y:14}].map(({x,y},i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill={ca(0.88)}
          style={{transformOrigin:`${x}px ${y}px`, animation:`hs-ping 2.4s ease-in-out ${(i*0.25).toFixed(2)}s infinite`}}/>
      ))}
    </svg>
  );

  /* ── Supplier: network nodes, centred at 32 ── */
  if (deptId === 'supplier') return (
    <svg width="100%" height="64" viewBox="0 0 88 64">
      {[[44,32,14,8],[44,32,74,8],[44,32,74,56],[44,32,14,56],[44,32,44,3],[44,32,44,61]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ca(0.18)} strokeWidth="1"/>
      ))}
      {[[44,32,8,0.85],[14,8,5,0.60],[74,8,5,0.60],[74,56,5,0.60],[14,56,5,0.60],[44,3,4,0.45],[44,61,4,0.45]].map(([x,y,r,a],i) => (
        <g key={i} style={{transformOrigin:`${x}px ${y}px`, animation:`hs-ping 2.6s ease-in-out ${(i*0.35).toFixed(2)}s infinite`}}>
          <circle cx={x} cy={y} r={r} fill={ca(a)} stroke={ca(0.30)} strokeWidth="1"/>
        </g>
      ))}
    </svg>
  );

  return null;
}

export default function DummyHub({ currentUser = null }) {
  const vw = useWindowSize();
  const L  = getLayout(vw);
  const navigate = useNavigate();

  const [phase, setPhase]           = useState('select');
  const [selDept, setSelDept]       = useState(null);
  const [code, setCode]             = useState('');
  const [showCode, setShowCode]     = useState(false);
  const [shake, setShake]           = useState(false);
  const [errMsg, setErrMsg]         = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [typedDef, setTypedDef]     = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const typingRef                   = useRef(null);
  const [typedBrief, setTypedBrief] = useState('');
  const [isBriefTyping, setIsBriefTyping] = useState(false);
  const [typedStats, setTypedStats] = useState(['', '']);
  const [briefStep, setBriefStep]   = useState(0);
  const briefTypingRef              = useRef(null);
  const inputRef                    = useRef(null);
  const [activeIdx, setActiveIdx]   = useState(2);
  const touchStartX                 = useRef(null);
  const scrollLock                  = useRef(false);
  const videoRef                    = useRef(null);
  const [zooming,     setZooming]     = useState(false);
  const [pendingDept, setPendingDept] = useState(null);

  /* Force-play the background video — React's autoPlay attr is unreliable */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop  = true;
    v.play().catch(() => {});   // swallow NotAllowedError on strict browsers
  }, []);
 
  React.useEffect(() => {
    clearTimeout(typingRef.current);
    if (expandedCard) {
      const full = DEPT_META[expandedCard]?.definition || '';
      setTypedDef('');
      setIsTyping(true);
      let i = 0;
      const typeNext = () => {
        if (i >= full.length) { setIsTyping(false); return; }
        i++;
        setTypedDef(full.slice(0, i));
        const ch = full[i - 1];
        const delay = ch === '\n' ? 800 : '.!?'.includes(ch) ? 300 : ','.includes(ch) ? 180 : 72;
        typingRef.current = setTimeout(typeNext, delay);
      };
      typingRef.current = setTimeout(typeNext, 72);
    } else {
      setTypedDef('');
      setIsTyping(false);
    }
    return () => clearTimeout(typingRef.current);
  }, [expandedCard]);

  React.useEffect(() => {
    clearInterval(briefTypingRef.current);
    setTypedBrief(''); setIsBriefTyping(false);
    setTypedStats(['', '']); setBriefStep(0);

    const meta = Object.values(DEPT_META)[activeIdx];
    if (!meta) return;
    const def = meta.definition || '';
    const v0  = meta.stats[0]?.v || '';
    const v1  = meta.stats[1]?.v || '';

    // 1 — name slides in
    const tName = setTimeout(() => setBriefStep(1), 80);

    // 2 — stat values type one after the other, then definition
    const tStats = setTimeout(() => {
      setBriefStep(2);
      let i0 = 0;
      briefTypingRef.current = setInterval(() => {
        i0++;
        setTypedStats([v0.slice(0, i0), '']);
        if (i0 >= v0.length) {
          clearInterval(briefTypingRef.current);
          let i1 = 0;
          briefTypingRef.current = setInterval(() => {
            i1++;
            setTypedStats([v0, v1.slice(0, i1)]);
            if (i1 >= v1.length) {
              clearInterval(briefTypingRef.current);
              // 3 — definition types
              setBriefStep(3); setIsBriefTyping(true);
              let id = 0;
              briefTypingRef.current = setInterval(() => {
                id++;
                setTypedBrief(def.slice(0, id));
                if (id >= def.length) {
                  clearInterval(briefTypingRef.current);
                  setIsBriefTyping(false); setBriefStep(4);
                }
              }, 16);
            }
          }, 55);
        }
      }, 55);
    }, 260);

    // 4 — chips guaranteed visible after 1.4 s regardless
    const tChips = setTimeout(() => setBriefStep(s => Math.max(s, 4)), 1400);

    return () => {
      clearTimeout(tName); clearTimeout(tStats); clearTimeout(tChips);
      clearInterval(briefTypingRef.current);
    };
  }, [activeIdx]);
 
  const depts = [
    {
      id:'sales', label:'Sales & Marketing', hint:'Enter sales code',
      color:'#00e5ff', a:'0,229,255', b:'6,182,212',
      icon:(c)=>(<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>),
    },
    {
      id:'estimation', label:'Estimation', hint:'Enter estimation code',
      color:'#7c3aed', a:'124,58,237', b:'109,40,217',
      icon:(c)=>(<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="8" y1="15" x2="11" y2="15"/></svg>),
    },
    {
      id:'contracts', label:'Contracts', hint:'Enter contracts code',
      color:'#ec4899', a:'236,72,153', b:'219,39,119',
      icon:(c)=>(<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6M9 17h4"/></svg>),
    },
    {
      id:'engineering', label:'Engineering', hint:'Enter engineering code',
      color:'#06b6d4', a:'6,182,212', b:'14,165,233',
      icon:(c)=>(<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>),
    },
    {
      id:'salesorder', label:'Sales Order', hint:'Enter sales order code',
      color:'#818cf8', a:'129,140,248', b:'99,102,241',
      icon:(c)=>(<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>),
    },
    {
      id:'supplier', label:'Supplier', hint:'Enter supplier code',
      color:'#a855f7', a:'168,85,247', b:'147,51,234',
      icon:(c)=>(<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>),
    },
  ];
 
  const pickDept = (dept) => {
    if (dept.id === 'estimation') {
      if (currentUser) { navigate('/estimation-hub'); return; }
      setSelDept(dept); setCode(''); setErrMsg(''); setPhase('code');
      setTimeout(() => inputRef.current?.focus(), 80);
      return;
    }
    if (dept.id === 'sales')     { navigate('/sales');        return; }
    if (dept.id === 'contracts') { navigate('/construction'); return; }
    // salesorder, supplier, engineering — show code entry (coming soon)
    setSelDept(dept); setCode(''); setErrMsg(''); setPhase('code');
    setTimeout(() => inputRef.current?.focus(), 80);
  };
  const doShake = (msg) => {
    setErrMsg(msg); setShake(true);
    setTimeout(() => { setShake(false); setCode(''); }, 620);
  };
  const handleSubmit = (e) => {
    e?.preventDefault();
    const entered = code.trim().toUpperCase();
    if (!entered) return;
    if (!selDept) return;
    if (selDept.id === 'estimation') {
      const user = findEmployeeByCode(entered);
      if (user) { navigate('/estimation-hub'); }
      else doShake('Invalid access code');
      return;
    }
    if (selDept.id === 'sales') { navigate('/sales'); return; }
    if (selDept.id === 'contracts') { navigate('/construction'); return; }
    doShake('Module coming soon');
  };
 
  // ── Arc constants — all driven by responsive layout ──
  const N       = depts.length;
  const RADIUS  = L.RADIUS;
  const PW      = L.PW;
  const PH      = L.PH;
  const STAGE_H = L.STAGE_H;
 
  const CARD_ANGLES = {
    '-5': -80, '-4': -64, '-3': -48,
    '-2': -35, '-1': -25,  '0':  35,
     '1':  16,  '2':  32,  '3':  48,
     '4':  64,  '5':  80,
  };
  const cardAngle = (relIdx) => CARD_ANGLES[String(relIdx)] ?? relIdx * 14;
 
  const goNext = () => {
    if (scrollLock.current || expandedCard) return;
    scrollLock.current = true;
    setTimeout(() => { scrollLock.current = false; }, 420);
    setActiveIdx(prev => Math.min(prev + 1, N - 1));
  };
  const goPrev = () => {
    if (scrollLock.current || expandedCard) return;
    scrollLock.current = true;
    setTimeout(() => { scrollLock.current = false; }, 420);
    setActiveIdx(prev => Math.max(prev - 1, 0));
  };
  const onWheel = (e) => {
    if (e.deltaX > 15 || e.deltaY > 15) goNext();
    else if (e.deltaX < -15 || e.deltaY < -15) goPrev();
  };
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 40) { touchStartX.current = null; return; }
    diff > 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };
 
  const activeDept = depts[activeIdx];
  const activeMeta  = DEPT_META[activeDept.id];
 
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:200,
      background:'#000',
      fontFamily:"'Inter',sans-serif", color:'#e2e8f0', overflow:'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Barlow+Condensed:wght@600;700&display=swap');
 
        /* ── AURORA: single looping keyframe, same as title ── */
        @keyframes hs-aurora  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        :root { --aurora: linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%); --aurora-sz:300% auto; }
 
        @keyframes hs-fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hs-shake   { 0%{transform:translateX(0)} 15%{transform:translateX(-10px)} 30%{transform:translateX(10px)} 45%{transform:translateX(-8px)} 60%{transform:translateX(8px)} 75%{transform:translateX(-4px)} 90%{transform:translateX(4px)} 100%{transform:translateX(0)} }
        @keyframes hs-errP    { 0%{box-shadow:0 0 0 rgba(220,30,30,0)} 50%{box-shadow:0 0 22px rgba(220,30,30,0.7)} 100%{box-shadow:0 0 8px rgba(220,30,30,0.3)} }
        @keyframes cardSweep  { 0%{left:-60%} 70%,100%{left:130%} }
        @keyframes hs-spin      { to{transform:rotate(360deg)} }
        @keyframes hs-spin-rev  { to{transform:rotate(-360deg)} }
        @keyframes hs-orbit-x   { to{transform:rotateX(60deg) rotateZ(360deg)} }
        @keyframes hs-orbit-y   { to{transform:rotateY(60deg) rotateZ(-360deg)} }
        @keyframes hs-pulse-ring{
          0%  { transform:translate(-50%,-50%) scale(0.55); opacity:0.9; }
          100%{ transform:translate(-50%,-50%) scale(2.2);  opacity:0; }
        }
        @keyframes hs-radar     { to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes hs-core-glow {
          0%,100%{ box-shadow:0 0 24px 4px var(--tc-glow), inset 0 0 20px rgba(255,255,255,0.05); }
          50%    { box-shadow:0 0 60px 16px var(--tc-glow), inset 0 0 40px rgba(255,255,255,0.12); }
        }
        @keyframes hs-dot-orbit { to{transform:rotate(360deg) translateX(88px) rotate(-360deg)} }
        @keyframes hs-ticker    { 0%{opacity:0.2} 50%{opacity:1} 100%{opacity:0.2} }
        @keyframes hs-bar-grow  { 0%{transform:scaleY(0.12)} 100%{transform:scaleY(1)} }
        @keyframes hs-wave-bar  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
        @keyframes hs-wave-color { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
        @keyframes hs-watermark { 0%,100%{opacity:0;transform:translate(-50%,-50%) scale(0.94)} 18%,82%{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes hs-net-dash  { 0%{stroke-dashoffset:600} 100%{stroke-dashoffset:0} }
        @keyframes hs-scan-ln   { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(54px)} }
        @keyframes hs-stroke    { from{stroke-dashoffset:300} to{stroke-dashoffset:0} }
        @keyframes hs-float-up  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-11px)} }
        @keyframes hs-ping      { 0%,100%{transform:scale(0.80);opacity:0.38} 50%{transform:scale(1.35);opacity:1} }
        @keyframes hs-tick-hand { from{transform:rotate(-30deg)} to{transform:rotate(30deg)} }
        @keyframes hs-glint {
          0%   { left:-25%; opacity:0; }
          8%   { opacity:1; }
          92%  { opacity:1; }
          100% { left:120%; opacity:0; }
        }
        @keyframes hs-corner-flash {
          0%,100%{ opacity:0.45; transform:scale(1); }
          50%    { opacity:1;    transform:scale(1.8); }
        }
        @keyframes hs-edge-pulse {
          0%,100%{ opacity:0.55; }
          50%    { opacity:1; }
        }
        @keyframes hs-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
        .hs-type-cursor { display:inline-block; width:2px; height:0.82em; background:currentColor; margin-left:2px; vertical-align:text-bottom; animation:hs-cursor 0.75s step-end infinite; }
        @keyframes hs-circuit { 0%{stroke-dashoffset:400} 100%{stroke-dashoffset:0} }
        @keyframes hs-scan-v  { 0%,100%{top:0%;opacity:0} 10%{opacity:1} 90%{opacity:1} 95%{top:100%;opacity:0} }
        @keyframes hs-particle-up { 0%{transform:translateY(0) scale(1);opacity:0.7} 100%{transform:translateY(-120px) scale(0);opacity:0} }
        @keyframes hs-hex-rot { to{transform:rotate(360deg)} }
        @keyframes hs-node-pulse { 0%,100%{r:3;opacity:0.4} 50%{r:5.5;opacity:1} }
        @keyframes hs-data-blink { 0%,100%{opacity:0.12} 50%{opacity:0.45} }
        @keyframes hs-boot-line { 0%{opacity:0;transform:translateX(-6px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes hs-scan-h { 0%{top:0%;opacity:0.9} 85%{opacity:0.6} 100%{top:100%;opacity:0} }
        @keyframes hs-vscreen-cycle {
          0%,100%{ opacity:0; transform:scale(0.86) translateY(10px); }
          5%     { opacity:1; transform:scale(1) translateY(0); }
          23%    { opacity:1; transform:scale(1) translateY(0); }
          30%    { opacity:0; transform:scale(0.93) translateY(-7px); }
        }
 
        /* ── Aurora drift — used for the soft secondary radial overlays only ── */
        @keyframes hs-aurora-drift1 {
          0%   { transform:translateY(-22%) scaleX(1.05); opacity:0.85; }
          50%  { transform:translateY(22%)  scaleX(1.0);  opacity:1.0; }
          100% { transform:translateY(-22%) scaleX(1.05); opacity:0.85; }
        }
        @keyframes hs-aurora-drift4 {
          0%   { transform:translateY(20%)  scaleX(1.0);  opacity:0.88; }
          50%  { transform:translateY(-20%) scaleX(1.04); opacity:1.0; }
          100% { transform:translateY(20%)  scaleX(1.0);  opacity:0.88; }
        }
 @keyframes hs-ping {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}
        /* branding */
        .hs-topbrand { position:absolute; top:22px; left:6%; z-index:30; display:flex; flex-direction:column; gap:0px; animation:hs-fadeUp 0.5s ease both; }
        .hs-topbrand-naffco {
          font-size:clamp(0.78rem,1vw,0.95rem); font-weight:500; letter-spacing:0.28em;
          text-transform:uppercase; line-height:1;
          color:#00aaff;
          filter:drop-shadow(0 1px 8px rgba(0,170,255,0.55));
        }
        .hs-topbrand-sub { font-size:clamp(0.52rem,0.65vw,0.62rem); font-weight:400; letter-spacing:0.38em; text-transform:uppercase; color:rgba(255,255,255,0.28); margin-bottom:10px; }
        .hs-title {
          font-family:'Cinzel',serif; font-size:clamp(2.15rem,4.3vw,4rem); font-weight:400; letter-spacing:0.08em; text-transform:uppercase; line-height:1.1; margin-bottom:6px;
          background:linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%);
          background-size:300% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          filter:drop-shadow(0 2px 20px rgba(6,182,212,0.50)); animation:hs-aurora 5s ease infinite;
        }
        .hs-state-of-art { font-family:'Barlow Condensed',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.38em; text-transform:uppercase; color:rgba(255,255,255,0.32); margin-top:-4px; }
 
        /* icon */
        .hs-icon-wrap { position:relative; width:54px; height:54px; flex-shrink:0; }
        .hs-icon-ring { position:absolute; inset:-2px; border-radius:13px; background:conic-gradient(from 0deg,#00e5ff 0deg,#4f46e5 90deg,#a855f7 180deg,#06b6d4 270deg,#00e5ff 360deg); animation:hs-spin 3.5s linear infinite; opacity:0.65; }
        .hs-panel:hover .hs-icon-ring { opacity:1; }
        .hs-icon-bg  { position:absolute; inset:2px; border-radius:11px; background:rgba(6,4,22,0.90); display:flex; align-items:center; justify-content:center; }
 
        /* code entry */
        .hs-cinput { background:transparent;border:none;border-bottom:2px solid #333;outline:none; color:#e0e0e0;font-size:clamp(20px,3vw,36px);font-weight:600;letter-spacing:0.3em;text-align:center; text-transform:uppercase;width:clamp(200px,28vw,320px);padding:8px 0; caret-color:#cc0000;transition:border-color 0.3s; }
        .hs-cinput:focus  { border-bottom-color:#cc0000; }
        .hs-cinput.hs-err { border-bottom-color:#dc1e1e;color:#dc1e1e;animation:hs-errP 0.5s ease forwards; }
        .hs-cform.hs-shake { animation:hs-shake 0.6s cubic-bezier(0.36,0.07,0.19,0.97) both; }
        .hs-back { display:inline-flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer; color:rgba(255,255,255,0.38);font-size:0.75rem;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:28px;padding:0;transition:color 0.2s; }
        .hs-back:hover { color:rgba(255,255,255,0.75); }
        .hs-hint   { font-size:11px;letter-spacing:0.3em;color:#2a2a2a;text-transform:uppercase;margin-top:22px; }
        .hs-errmsg { font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:#dc1e1e;margin-top:10px;opacity:0;transition:opacity 0.2s; }
        .hs-errmsg.vis { opacity:1; }
 
        /* card label — ceramic white shine */
        @keyframes hs-shine { 0%{background-position:-250% center} 100%{background-position:250% center} }
        .hs-card-label-aurora {
          font-family:'Cinzel',serif;
          font-size:1.55rem; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; line-height:1.15;
          background:linear-gradient(90deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%);
          background-size:300% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation:hs-aurora 5s ease infinite;
          filter:drop-shadow(0 0 18px rgba(6,182,212,0.80)) drop-shadow(0 2px 14px rgba(0,0,0,0.90));
        }
        .hs-card-label {
          font-family:'Cinzel',serif;
          font-size:1.55rem; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; line-height:1.15;
          background:linear-gradient(90deg,
            #c8c0b0 0%,
            #ede8df 22%,
            #ffffff 34%,
            #f8f4ee 42%,
            #ffffff 50%,
            #f0ebe2 58%,
            #ffffff 66%,
            #ede8df 78%,
            #c8c0b0 100%
          );
          background-size:250% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation:hs-shine 5s linear infinite;
          filter:drop-shadow(0 0 10px rgba(255,252,245,0.45)) drop-shadow(0 2px 12px rgba(0,0,0,0.80));
        }
 
        /* AR pill */
        .hs-ar-btn { position:absolute; bottom:24px; right:24px; z-index:40; display:inline-flex; align-items:center; gap:7px; background:rgba(10,8,26,0.65); border:1px solid rgba(255,255,255,0.28); border-radius:100px; padding:8px 18px; cursor:pointer; color:rgba(255,255,255,0.88); font-size:0.72rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; transition:all 0.3s cubic-bezier(0.4,0,0.2,1); backdrop-filter:blur(14px); box-shadow:0 4px 15px rgba(0,0,0,0.4); }
        .hs-ar-btn:hover { background:rgba(0,229,255,0.15); border-color:rgba(0,229,255,0.60); color:#fff; box-shadow:0 0 20px rgba(0,229,255,0.35); transform:translateY(-2px); }
        .hs-ar-dot { width:7px; height:7px; border-radius:50%; background:#00e5ff; box-shadow:0 0 10px #00e5ff; }

        /* ═══════════════════════════════
           RESPONSIVE OVERRIDES
        ═══════════════════════════════ */

        /* Tablet landscape / small laptop (768–1023px) */
        @media (max-width:1023px) {
          .hs-topbrand { left:14px!important; }
          .hs-title { font-size:clamp(1.5rem,3.8vw,2.8rem)!important; }
          .hs-state-of-art { font-size:0.68rem; letter-spacing:0.28em; }
          .hs-card-label-aurora, .hs-card-label { font-size:1.1rem!important; }
          .hs-icon-wrap { width:42px!important; height:42px!important; }
          .hs-ar-btn { padding:6px 14px; font-size:0.66rem; }
        }

        /* Small tablet / large mobile (480–767px) */
        @media (max-width:767px) {
          .hs-topbrand { left:10px!important; }
          .hs-title { font-size:clamp(1.2rem,5.5vw,2.2rem)!important; }
          .hs-state-of-art { font-size:0.58rem; letter-spacing:0.20em; }
          .hs-card-label-aurora, .hs-card-label { font-size:0.90rem!important; }
          .hs-icon-wrap { width:34px!important; height:34px!important; }
          .hs-icon-ring { border-radius:9px!important; }
          .hs-icon-bg   { border-radius:7px!important; }
          .hs-ar-btn { padding:5px 11px; font-size:0.60rem; gap:5px; }
          .hs-back { font-size:0.65rem; margin-bottom:14px; }
          .hs-cinput { width:clamp(160px,72vw,260px)!important; font-size:clamp(16px,4.5vw,26px)!important; }
          .hs-hint   { font-size:9px; }
          .hs-errmsg { font-size:10px; }
          .hs-topbrand-naffco { font-size:0.70rem; }
          .hs-topbrand-sub    { font-size:0.48rem; margin-bottom:6px; }
        }

        /* Mobile portrait (<480px) */
        @media (max-width:479px) {
          .hs-topbrand { left:8px!important; }
          .hs-title { font-size:clamp(1.0rem,6.5vw,1.7rem)!important; }
          .hs-state-of-art { display:none; }
          .hs-card-label-aurora, .hs-card-label { font-size:0.75rem!important; }
          .hs-icon-wrap { width:28px!important; height:28px!important; }
          .hs-icon-ring { border-radius:7px!important; }
          .hs-icon-bg   { border-radius:5px!important; }
          .hs-ar-btn { padding:4px 9px; font-size:0.55rem; gap:4px; }
          .hs-ar-dot { width:5px; height:5px; }
          .hs-back { font-size:0.58rem; margin-bottom:10px; }
          .hs-cinput { width:clamp(140px,80vw,240px)!important; font-size:clamp(14px,5vw,22px)!important; letter-spacing:0.20em!important; }
          .hs-topbrand-naffco { font-size:0.62rem; letter-spacing:0.18em; }
          .hs-topbrand-sub    { display:none; }
        }

        /* Wide / external display (≥1440px) */
        @media (min-width:1440px) {
          .hs-title { font-size:clamp(2.8rem,3.5vw,4.5rem)!important; }
          .hs-card-label-aurora, .hs-card-label { font-size:1.7rem!important; }
          .hs-icon-wrap { width:60px!important; height:60px!important; }
          .hs-icon-ring { border-radius:15px!important; }
          .hs-icon-bg   { border-radius:13px!important; }
          .hs-ar-btn { padding:9px 20px; font-size:0.76rem; }
        }
      `}</style>
 
      {/* ══ LAYER 1: DARK BASE ══ */}
      <div style={{position:'absolute',inset:0,zIndex:0,background:'#010106',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,left:0,width:'50%',height:'100%',zIndex:0,background:'#010106',pointerEvents:'none'}}/>

      {/* ══ LAYER 2: AURORA — right half rainbow glow ══ */}
      <div style={{position:'absolute',top:0,right:0,width:'55%',height:'100%',zIndex:1,overflow:'hidden',pointerEvents:'none'}}>
        <div style={{
          position:'absolute',top:'-10%',left:'0%',right:'0%',bottom:'-5%',
          background:'conic-gradient(from 0deg at 50% 50%,#ff0000,#ff7700,#ffff00,#00ff88,#00cfff,#6d28d9,#a855f7,#ec4899,#ff0000)',
          backgroundSize:'300% 300%',
          animation:'hs-aurora 6s ease-in-out infinite',
          filter:'blur(55px)',opacity:0.60,
          WebkitMaskImage:'radial-gradient(ellipse 85% 90% at 50% 50%,black 5%,rgba(0,0,0,0.50) 50%,transparent 78%)',
          maskImage:'radial-gradient(ellipse 85% 90% at 50% 50%,black 5%,rgba(0,0,0,0.50) 50%,transparent 78%)',
        }}/>
        <div style={{
          position:'absolute',top:'-2%',left:'8%',right:'8%',bottom:'0%',
          background:'linear-gradient(120deg,#ff0000 0%,#ff6600 12%,#ffcc00 24%,#00ff88 36%,#00bfff 48%,#3b82f6 58%,#8b5cf6 68%,#ec4899 80%,#ff3366 90%,#ff0000 100%)',
          backgroundSize:'300% 300%',
          animation:'hs-aurora 4s ease-in-out infinite reverse',
          filter:'blur(30px)',opacity:0.70,
          WebkitMaskImage:'radial-gradient(ellipse 72% 80% at 50% 44%,black 10%,rgba(0,0,0,0.55) 52%,transparent 78%)',
          maskImage:'radial-gradient(ellipse 72% 80% at 50% 44%,black 10%,rgba(0,0,0,0.55) 52%,transparent 78%)',
        }}/>
        <div style={{
          position:'absolute',top:'8%',left:'20%',right:'18%',bottom:'2%',
          background:'linear-gradient(160deg,#ff4444 0%,#ff9900 20%,#ffee00 35%,#a855f7 55%,#ec4899 72%,#ff6600 88%,#ff0000 100%)',
          backgroundSize:'250% 250%',
          animation:'hs-aurora 3.5s ease-in-out infinite',
          filter:'blur(16px)',opacity:0.80,
          WebkitMaskImage:'radial-gradient(ellipse 55% 68% at 50% 42%,black 18%,rgba(0,0,0,0.45) 55%,transparent 78%)',
          maskImage:'radial-gradient(ellipse 55% 68% at 50% 42%,black 18%,rgba(0,0,0,0.45) 55%,transparent 78%)',
        }}/>
        <div style={{position:'absolute',top:0,left:0,width:'28%',height:'100%',background:'linear-gradient(to right,#010106 0%,transparent 100%)',pointerEvents:'none'}}/>
      </div>

      {/* ══ LAYER 3: AI BOT IMAGE ══ */}
      <div style={{position:'absolute',inset:0,zIndex:2,pointerEvents:'none'}}>
        <img src="/AIBOT.png" alt="AI Bot" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',pointerEvents:'none'}}/>
      </div>

      {/* global dim overlay */}
      <div style={{position:'absolute',inset:0,zIndex:3,background:'rgba(1,1,6,0.22)',pointerEvents:'none'}}/>

      {/* ══ LAYER 3: TEXT BRANDING ══ */}
 
      {/* ── NAFFCO wordmark — extreme left ── */}
      <div style={{ position:'absolute', top:L.brandTop, left:L.brandLeft, zIndex:30, display:'flex', flexDirection:'column', gap:0, animation:'hs-fadeUp 0.5s ease both' }}>
        <div className="hs-topbrand-naffco"><span style={{ fontWeight:900, letterSpacing:'0.18em' }}>NAFFCO</span> <span style={{ fontWeight:400 }}>AI APEX</span></div>
        <div className="hs-topbrand-sub" style={{ marginTop:3 }}>Passion to Protect</div>
      </div>
 
      {/* ── AI APEX HUB title + STATE OF ART — 6% from left ── */}
      <div className="hs-topbrand">
        <h1 className="hs-title" style={{ marginTop:L.titleMarginTop }}>AI APEX HUB</h1>
        <p className="hs-state-of-art" style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:7, height:9, borderRadius:'50%', background:'#cc0000', boxShadow:'0 0 6px #cc0000, 0 0 14px rgba(204,0,0,0.55)', flexShrink:0, display:'inline-block' }}/>
          <span style={{ flex:1, height:1, background:'linear-gradient(to right, rgba(204,0,0,0.70) 0%, rgba(255,255,255,0.18) 100%)', display:'inline-block' }}/>
          <span>STATE OF ART</span>
        </p>
      </div>
 
      {/* ── BOTTOM-LEFT LOGO ── */}
      <img src="/logo.png" alt="NAFFCO" style={{
        position:'absolute', bottom:L.arBottom, left:L.brandLeft, zIndex:30,
        height:L.logoH, objectFit:'contain', opacity:0.55,
        filter:'drop-shadow(0 1px 8px rgba(109,40,217,0.35))',
        animation:'hs-fadeUp 0.6s ease both', cursor:'pointer',
      }} onClick={() => alert('Cost Artist Login Prompt!')} />
 
      {/* ── AR VIEWER ── */}
      <button className="hs-ar-btn" onClick={() => alert('AR Viewer Activated!')}>
        <span className="hs-ar-dot"/> AR Viewer
      </button>

 
      {/* ══ LAYER 4.5: FULL-SCREEN LIQUID GLASS FROST — covers everything when card is expanded ══ */}
      <AnimatePresence>
        {expandedCard && (
          <motion.div
            key="global-frost"
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.50, ease:[0.22,1,0.36,1] }}
            onClick={() => setExpandedCard(null)}
            style={{
              position:'fixed', inset:0, zIndex:50, cursor:'default',
              background:'rgba(1,4,20,0.30)',
              backdropFilter:'blur(8px) saturate(80%) brightness(0.75)',
              WebkitBackdropFilter:'blur(8px) saturate(80%) brightness(0.75)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ══ LAYER 5: CARDS + NAVIGATION ══ */}
      <AnimatePresence>
        {phase === 'select' && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.5 }}
            onWheel={onWheel}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={() => { if (expandedCard) setExpandedCard(null); }}
            style={{
              position:'absolute',
              top:L.stageTop, left:0, right:vw < 768 ? 0 : 55, bottom:15,
              perspective:`${RADIUS * 1.1}px`,
              perspectiveOrigin: '10% 65%',
              zIndex: expandedCard ? 60 : 20,
            }}
          >
            {/* ── arc panels ── */}
            {depts.map((dept, idx) => {
              const relIdx     = idx - activeIdx;
              const angle      = cardAngle(relIdx);
              const isExpanded = expandedCard === dept.id;
              const isHidden   = expandedCard && !isExpanded;
              const floats     = FLOATS[dept.id] || [];
 
              return (
                <motion.div
                  key={dept.id}
                  className="hs-panel"
                  transformTemplate={({ x, rotateY, z, scale, scaleX, scaleY }) => {
                    const s = scale ?? 1;
                    const sx = scaleX != null ? scaleX * s : s;
                    const sy = scaleY != null ? scaleY * s : s;
                    const tx = x == null ? '-50%' : (typeof x === 'number' ? `${x}px` : x);
                    return `translateX(${tx}) rotateY(${rotateY ?? 'deg'}) translateZ(${z ?? '0px'}) scaleX(${sx}) scaleY(${sy})`;
                  }}
                  style={{
                    '--tc': dept.color,
                    position:'absolute',
                    left: L.cardLeft, bottom:L.cardBottom,
                    originX:'50%', originY:'50%',
                    borderRadius:'0px',
                    cursor:'pointer', overflow: relIdx === 0 ? 'visible' : 'hidden',
                    backdropFilter: isExpanded ? 'blur(1.5px) saturate(100%) brightness(1.06)' : 'blur(1.5px) saturate(100%) brightness(1.06)',
                    zIndex: isExpanded ? 22 : (expandedCard ? 4 : Math.max(1, 12 - Math.abs(relIdx))),
                  }}
                  initial={false}
                  animate={isExpanded ? {
                    x: L.expandX, rotateY: 0, z: 300,
                    scale: 1,
                    width: L.expandW, height: L.expandH,
                    opacity: 1,
                    background:'rgba(255,255,255,0.018)',
                    border:'1px solid rgba(200,225,255,0.14)',
                    boxShadow:'0 8px 32px rgba(0,8,40,0.12), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(180,210,255,0.06), inset 1px 0 0 rgba(255,255,255,0.08), inset -1px 0 0 rgba(180,210,255,0.04)',
                    transition:{
                      type:'tween', duration:0.90, ease:[0.22,1,0.36,1],
                      opacity:{ duration:0.45, ease:'easeOut' },
                      background:{ duration:0.80, ease:[0.22,1,0.36,1] },
                      boxShadow:{ duration:0.85, ease:[0.22,1,0.36,1] },
                      border:{ duration:0.80, ease:[0.22,1,0.36,1] },
                    },
                  } : (() => {
                    // ── DEPTH QUEUE: active card left+biggest, others shrink right ──
                    const SCALE_STEP = 0.78; // each card is 78% of the previous
                    const GAP_RATIO  = 0.84; // gap between cards as fraction of current card width

                    // Compute cumulative x offset and scale for this relIdx
                    let qx = 0;
                    let qScale = 1;
                    if (relIdx > 0) {
                      let cw = PW;
                      for (let i = 0; i < relIdx; i++) {
                        qx += cw * GAP_RATIO;
                        cw *= SCALE_STEP;
                      }
                      qScale = Math.max(0.20, Math.pow(SCALE_STEP, relIdx));
                    } else if (relIdx < 0) {
                      // Cards before active: hide off-screen to the left
                      qx = relIdx * PW * 1.1;
                    }

                    return {
                      x: qx,
                      rotateY: relIdx === 0 ? 33 : relIdx * 8,
                      z: relIdx > 0 ? -(relIdx * 90) : 0,
                      scale: relIdx === 0 ? 1 : qScale,
                      width: PW *1.1,
                      height: PH *1.1,
                      opacity: isHidden ? 0 : relIdx < 0 ? 0 : relIdx === 0 ? 1 : Math.max(0.28, 1 - relIdx * 0.18),
                      background: 'rgba(255,255,255,0.018)',
                      border: `1px solid rgba(200,225,255,${relIdx === 0 ? 0.18 : Math.max(0.04, 0.12 - relIdx * 0.02)})`,
                      boxShadow: relIdx === 0
                        ? '0 24px 60px rgba(0,8,40,0.40), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(180,210,255,0.08)'
                        : '0 8px 32px rgba(0,8,40,0.20), inset 0 1px 0 rgba(255,255,255,0.10)',
                      transition:{
                        type:'tween', duration:0.52, ease:[0.22,1,0.36,1],
                        opacity:{ duration:0.26, ease:'easeOut' },
                      },
                    };
                  })()}
                  whileHover={!expandedCard && relIdx > 0 ? { scale: Math.max(0.20, Math.pow(0.78, relIdx)) + 0.05 } : {}}
                  whileTap={!expandedCard ? { scale: relIdx === 0 ? 1.03 : Math.max(0.18, Math.pow(0.78, relIdx)) - 0.04 } : {}}
                  onClick={(e) => { e.stopPropagation(); if (isExpanded) { if (dept.id === 'estimation') { navigate('/estimation-hub'); } else { setPendingDept(dept); setZooming(true); } } else if (relIdx === 0) { setExpandedCard(dept.id); } else { setActiveIdx(idx); } }}
                >
                  {/* ── LIQUID GLASS: top specular streak (real glass catches light on one edge) ── */}
                  <div style={{ position:'absolute', top:0, left:'18%', right:'18%', height:1, zIndex:30, background:`linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 30%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.10) 70%, transparent)`, pointerEvents:'none' }}/>
                  {/* subtle left-edge glint — like sunlight catching one rim */}
                  <div style={{ position:'absolute', top:'6%', left:0, height:'28%', width:1, zIndex:30, background:`linear-gradient(to bottom, transparent, rgba(255,255,255,0.14) 40%, rgba(255,255,255,0.08) 70%, transparent)`, pointerEvents:'none' }}/>
                  {/* inner lens refraction — very faint diagonal highlight like real curved glass */}
                  <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:`linear-gradient(128deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 28%, transparent 55%)`, borderRadius:'inherit' }}/>
                  {/* bottom-edge depth shadow — glass rests on a surface */}
                  <div style={{ position:'absolute', bottom:0, left:'8%', right:'8%', height:1, zIndex:30, background:`linear-gradient(90deg, transparent, rgba(0,10,60,0.18) 40%, rgba(0,10,60,0.22) 50%, rgba(0,10,60,0.18) 60%, transparent)`, pointerEvents:'none' }}/>
 
                  {/* ── NORMAL card face ── */}
                  <AnimatePresence>
                    {!isExpanded && (
                      <motion.div
                        variants={{
                          hidden: { opacity:0 },
                          visible: { opacity:1, transition:{ duration:0.28, delay:0.32 } },
                          exit:    { opacity:0, transition:{ duration:0.14 } },
                        }}
                        initial="hidden" animate="visible" exit="exit"
                        style={{ position:'absolute', inset:0, borderRadius:'inherit', overflow:'hidden' }}
                      >
                        {relIdx === 0 ? (
                          <>
                            <div style={{ position:'absolute', top:0, left:0, right:0, height:'50%', background:'linear-gradient(180deg,rgba(120,170,255,0.10) 0%,rgba(80,130,255,0.04) 40%,transparent 100%)', borderRadius:'0', pointerEvents:'none' }}/>
                            <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(140,190,255,0.40) 30%,rgba(160,205,255,0.55) 50%,rgba(140,190,255,0.40) 70%,transparent)', pointerEvents:'none' }}/>
                            <div style={{ position:'absolute', top:'4%', left:0, bottom:'15%', width:'45%', background:'linear-gradient(90deg,rgba(100,160,255,0.08) 0%,transparent 100%)', pointerEvents:'none' }}/>
                            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'35%', background:'linear-gradient(0deg,rgba(20,60,160,0.12) 0%,transparent 100%)', pointerEvents:'none' }}/>
                            <div style={{ position:'absolute', bottom:-55, left:'-20%', right:'-20%', height:70, background:'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(100,160,255,0.55) 0%, rgba(80,120,255,0.18) 50%, transparent 100%)', pointerEvents:'none', borderRadius:'50%', filter:'blur(8px)' }}/>
                            <div style={{ position:'absolute', bottom:-30, left:'5%', right:'5%', height:2, background:'linear-gradient(90deg,transparent,rgba(140,190,255,0.70) 25%,rgba(180,220,255,0.90) 50%,rgba(140,190,255,0.70) 75%,transparent)', pointerEvents:'none' }}/>
                            <div style={{ position:'absolute', top:'28%', left:12, right:12, textAlign:'center', lineHeight:1.25 }}>
                              <span className="hs-card-label-aurora" style={{ fontSize:'1.05rem' }}>{dept.label}</span>
                            </div>
                            <div style={{ position:'absolute', top:'56%', left:16, right:16, textAlign:'center', color:'rgba(255,255,255,0.45)', fontSize:'0.56rem', letterSpacing:'0.22em', textTransform:'uppercase', fontFamily:"'Inter',sans-serif" }}>AI MODULE</div>
                            {/* animated waveform */}
                            <div style={{ position:'absolute', top:'65%', left:'50%', transform:'translateX(-50%)', display:'flex', alignItems:'flex-end', gap:5, height:34 }}>
                              {[
                                {h:12,c:'#00e5ff',cd:0},{h:24,c:'#7c3aed',cd:3},{h:32,c:'#a855f7',cd:6},
                                {h:20,c:'#06b6d4',cd:9},{h:28,c:'#4f46e5',cd:12},{h:16,c:'#00e5ff',cd:15},{h:22,c:'#7c3aed',cd:18},
                              ].map(({h,c,cd},i) => (
                                <div key={i} style={{
                                  width:5,
                                  height:h,
                                  borderRadius:3,
                                  background: c,
                                  boxShadow:`0 0 8px ${c}bb, 0 0 3px ${c}`,
                                  animation:`hs-wave-bar ${1.4 + i * 0.22}s ease-in-out infinite, hs-wave-color ${4 + i * 0.5}s linear infinite`,
                                  animationDelay:`${i * 0.18}s, ${cd * 0.1}s`,
                                  flexShrink:0,
                                }}/>
                              ))}
                            </div>
                            <div style={{ position:'absolute', bottom:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(100,160,255,0.35) 35%,rgba(120,175,255,0.45) 50%,rgba(100,160,255,0.35) 65%,transparent)' }}/>
                          </>
                        ) : (
                          <>
                            <div style={{ position:'absolute', top:0, left:0, right:0, height:'42%', background:'linear-gradient(180deg,rgba(255,255,255,0.055) 0%,transparent 100%)', borderRadius:'0', pointerEvents:'none' }}/>
                            <div style={{ position:'absolute', top:'8%', left:0, bottom:'20%', width:'45%', background:'linear-gradient(90deg,rgba(255,255,255,0.028) 0%,transparent 100%)', pointerEvents:'none' }}/>
                            <div style={{ position:'absolute', top:'36%', left:'50%', transform:'translate(-50%,-50%)', opacity:Math.max(0.25,0.48-Math.abs(relIdx)*0.08) }}>
                              <svg width="38" height="26" viewBox="0 0 52 36" fill="none">
                                {[{x:2,h:10},{x:9,h:20},{x:16,h:30},{x:23,h:22},{x:30,h:34},{x:37,h:18},{x:44,h:12}].map((b,i)=>(
                                  <rect key={i} x={b.x} y={(36-b.h)/2} width="5" height={b.h} rx="2.5" fill="rgba(200,200,230,0.68)"/>
                                ))}
                              </svg>
                            </div>
                            {Math.abs(relIdx) <= 2 && (
                              <div style={{ position:'absolute', top:'50%', left:10, right:10, transform:'translateY(-50%)', textAlign:'center', color:`rgba(200,200,220,${Math.abs(relIdx)===1 ? 0.70 : 0.50})`, fontSize:'0.63rem', letterSpacing:'0.10em', fontFamily:"'Inter',sans-serif", fontWeight:500, lineHeight:1.4, textTransform:'uppercase' }}>{dept.label}</div>
                            )}
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
 
                  {/* ── EXPANDED content ── */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        variants={{
                          hidden: { opacity:0 },
                          visible: { opacity:1, transition:{ duration:0.42, delay:0.28 } },
                          exit:    { opacity:0, transition:{ duration:0.14 } },
                        }}
                        initial="hidden" animate="visible" exit="exit"
                        style={{ position:'absolute', inset:0 }}
                      >
                        {/* ── blurred background layer: watermark + network ── */}
                        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0, filter:'blur(1.8px)', opacity:0.85 }}>
                          {/* watermark */}
                          <div style={{ position:'absolute', top:'50%', left:'50%', textAlign:'center', animation:'hs-watermark 7s ease-in-out infinite', animationDelay:'1.0s', opacity:0 }}>
                            <div style={{ fontSize:'4rem', fontWeight:900, letterSpacing:'0.32em', color:'rgba(160,210,255,0.18)', textTransform:'uppercase', fontFamily:"'Inter',sans-serif", lineHeight:1, userSelect:'none' }}>AI APEX</div>
                            <div style={{ fontSize:'1.4rem', fontWeight:700, letterSpacing:'0.65em', color:'rgba(140,195,255,0.12)', textTransform:'uppercase', fontFamily:"'Inter',sans-serif", marginTop:6, userSelect:'none' }}>NAFFCO</div>
                          </div>
                          {/* network web + circuit lines */}
                          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 1000 540" preserveAspectRatio="none">
                            {[80,180,280,380,460].map((y,i) => (
                              <line key={`h${i}`} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(140,190,255,0.18)" strokeWidth="0.7" strokeDasharray="14 30" style={{ animation:`hs-data-blink ${2.8+i*0.40}s ease-in-out ${i*0.30}s infinite` }}/>
                            ))}
                            {[120,280,460,620,800].map((x,i) => (
                              <line key={`v${i}`} x1={x} y1="0" x2={x} y2="540" stroke="rgba(140,190,255,0.14)" strokeWidth="0.7" strokeDasharray="10 36" style={{ animation:`hs-data-blink ${3.2+i*0.35}s ease-in-out ${i*0.25}s infinite` }}/>
                            ))}
                            {[[120,80],[280,180],[460,80],[620,280],[800,180],[120,460],[460,380],[800,460]].map(([x,y],i) => (
                              <circle key={`n${i}`} cx={x} cy={y} r="4" fill="rgba(160,205,255,0.70)" style={{ animation:`hs-node-pulse ${2.0+i*0.28}s ease-in-out ${i*0.35}s infinite` }}/>
                            ))}
                            <path d="M120,80 L120,180 L280,180 L280,80 L460,80" stroke="rgba(100,180,255,0.60)" strokeWidth="1.3" fill="none" strokeDasharray="700" strokeDashoffset="700" style={{ animation:'hs-net-dash 4s ease-in-out 0.5s infinite alternate' }}/>
                            <path d="M620,280 L620,180 L800,180 L800,80" stroke="rgba(140,80,255,0.55)" strokeWidth="1.3" fill="none" strokeDasharray="700" strokeDashoffset="700" style={{ animation:'hs-net-dash 4.5s ease-in-out 1.2s infinite alternate' }}/>
                            <path d="M120,460 L280,460 L280,380 L460,380 L460,280" stroke="rgba(0,210,255,0.50)" strokeWidth="1.3" fill="none" strokeDasharray="700" strokeDashoffset="700" style={{ animation:'hs-net-dash 5s ease-in-out 0.8s infinite alternate' }}/>
                            <path d="M460,80 L460,180 L620,180 L620,80 L800,80" stroke="rgba(0,229,255,0.45)" strokeWidth="1" fill="none" strokeDasharray="600" strokeDashoffset="600" style={{ animation:'hs-net-dash 5.5s ease-in-out 0.3s infinite alternate' }}/>
                            <path d="M800,460 L800,380 L620,380 L620,460 L460,460" stroke="rgba(168,85,247,0.45)" strokeWidth="1" fill="none" strokeDasharray="600" strokeDashoffset="600" style={{ animation:'hs-net-dash 4.8s ease-in-out 1.6s infinite alternate' }}/>
                          </svg>
                        </div>
 
                        {dept.id === 'estimation' ? (
                          /* ESTIMATION: video bot (blended) + AI text overlay */
                          <div style={{ position:'absolute', inset:0, overflow:'hidden', borderRadius:'inherit' }}>

                            {/* BOT VIDEO — mix-blend-mode:screen makes dark bg transparent */}
                            <video
                              src="/BOT_tn.mp4"
                              autoPlay loop muted playsInline
                              style={{
                                position:'absolute',
                                right:'-25%',
                                top:'54%',
                                transform:'translateY(-50%)',
                                height:'125%',
                                width:'auto',
                                mixBlendMode:'screen',
                                pointerEvents:'none',
                                zIndex:1,
                              }}
                            />

                            {/* soft right-edge fade so video blends into card border */}
                            <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'16%', background:'linear-gradient(to left,rgba(0,0,8,0.70) 0%,transparent 100%)', pointerEvents:'none', zIndex:2 }}/>

                            {/* LEFT: AI text panel — floats over blended video */}
                            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'54%', display:'flex', flexDirection:'column', padding:'16px 14px 12px 16px', overflow:'hidden', zIndex:3 }}>
                              <div style={{ position:'absolute', left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(0,229,255,0.60) 35%,rgba(0,229,255,0.90) 55%,transparent)', animation:'hs-scan-h 3.6s ease-in-out 0.8s infinite', pointerEvents:'none', zIndex:10 }}/>
                              <div style={{ display:'flex', flexDirection:'column', gap:5, marginBottom:150 }}>
                                {[
                                  { t:'> SYSTEM INITIALIZING...',    d:'0.35s', hi:false },
                                  { t:'> LOADING ESTIMATION MODELS', d:'0.85s', hi:false },
                                  { t:'> AI ENGINE CALIBRATED',      d:'1.35s', hi:false },
                                  { t:'> SYSTEM ONLINE  \u00b7  AI READY', d:'1.85s', hi:true  },
                                ].map(({ t, d, hi }, i) => (
                                  <div key={i} style={{ display:'flex', alignItems:'center', gap:6, opacity:0, animation:'hs-boot-line 0.45s ease forwards', animationDelay:d }}>
                                    {hi && <div style={{ width:5, height:5, borderRadius:'50%', flexShrink:0, background:'rgba(0,229,255,0.95)', boxShadow:'0 0 6px rgba(0,229,255,0.80)', animation:'hs-ticker 1.8s ease-in-out infinite' }}/>}
                                    <span style={{ fontSize:'0.50rem', fontFamily:"'Inter',monospace", letterSpacing:'0.14em', fontWeight: hi ? 700 : 500, color: hi ? 'rgba(0,229,255,0.92)' : 'rgba(140,190,255,0.52)' }}>{t}</span>
                                  </div>
                                ))}
                              </div>
                              <div style={{ opacity:0, animation:'hs-boot-line 0.60s ease forwards', animationDelay:'2.25s', marginBottom:8, marginTop:39 }}>
                                <div style={{ fontSize:'clamp(0.95rem,2.2vw,1.38rem)', fontWeight:400, fontFamily:"'Cinzel',serif", letterSpacing:'0.05em', textTransform:'uppercase', lineHeight:1.18, background:'linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%)', backgroundSize:'300% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'hs-aurora 5s ease infinite', filter:'drop-shadow(0 0 16px rgba(0,229,255,0.55))' }}>

                                </div>
                              </div>
                              <div style={{ height:1, background:'linear-gradient(to right,rgba(0,229,255,0.35),rgba(140,190,255,0.15),transparent)', marginBottom:10, opacity:0, animation:'hs-boot-line 0.40s ease forwards', animationDelay:'2.55s' }}/>
                              <div style={{ overflow:'hidden', marginTop:-52, opacity:0, animation:'hs-boot-line 0.60s ease forwards', animationDelay:'2.75s' }}>
                                <p style={{ margin:0, fontFamily:"'Inter',sans-serif", overflow:'hidden' }}>
                                  {typedDef.split('\n').map((line, i) => (
                                    <span key={i} style={{
                                      display:'block',
                                      background:'linear-gradient(90deg,#00e5ff 0%,#4f46e5 18%,#7c3aed 34%,#a855f7 50%,#06b6d4 68%,#00e5ff 100%)',
                                      backgroundSize:'300% auto',
                                      WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                                      animation:'hs-aurora 5s ease infinite',
                                      filter:'drop-shadow(0 0 8px rgba(0,229,255,0.30))',
                                      fontSize: i === 1 ? '0.90rem' : '0.80rem',
                                      fontWeight: i === 1 ? 400 : 500,
                                      lineHeight: i === 1 ? 2.2 : 1.78,
                                      letterSpacing: i === 1 ? '0.04em' : '0.02em',
                                    }}>
                                      {line}
                                      {isTyping && i === typedDef.split('\n').length - 1 && (
                                        <span className="hs-type-cursor" style={{ color:'rgba(0,229,255,1)', WebkitTextFillColor:'rgba(0,229,255,1)' }}/>
                                      )}
                                    </span>
                                  ))}
                                </p>
                              </div>
                              <div style={{ position:'absolute', bottom:14, left:16, display:'flex', flexDirection:'column', gap:4, opacity:0, animation:'hs-boot-line 0.45s ease forwards', animationDelay:'3.05s' }}>
                                <div style={{ fontSize:'0.44rem', letterSpacing:'0.32em', textTransform:'uppercase', color:'rgba(140,190,255,0.38)', fontWeight:700, fontFamily:"'Inter',sans-serif", marginBottom:4 }}>NAFFCO · AI MODULE</div>
                                {['SYSTEM ONLINE','AI READY','SECURE LINK'].map((txt,i) => (
                                  <div key={i} style={{ display:'flex', alignItems:'center', gap:5, animation:`hs-ticker 2.4s ease-in-out ${i*0.6}s infinite` }}>
                                    <div style={{ width:4, height:4, borderRadius:'50%', background:'rgba(0,229,255,0.88)', boxShadow:'0 0 5px rgba(0,229,255,0.70)' }}/>
                                    <span style={{ fontSize:'0.48rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(0,229,255,0.60)', fontWeight:600, fontFamily:"'Inter',sans-serif" }}>{txt}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{ position:'absolute', top:22, left:22, right:22 }}>
                              <span className="hs-card-label-aurora" style={{ fontSize:'1.8rem' }}>{dept.label}</span>
                            </div>
                            <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-60%)', display:'flex', alignItems:'center', gap:36, pointerEvents:'none', zIndex:2 }}>
                              <div style={{ position:'relative', width:96, height:96, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                {[0,1,2].map(i => (
                                  <div key={i} style={{ position:'absolute', inset: i * -14, borderRadius:'50%', border:`1.5px solid rgba(140,190,255,${0.38 - i * 0.11})`, animation:`hs-ping 2.8s ease-in-out ${i * 0.55}s infinite` }}/>
                                ))}
                                <div style={{ width:64, height:64, borderRadius:'50%', background:'radial-gradient(circle, rgba(100,160,255,0.16) 0%, rgba(80,130,220,0.06) 60%, transparent 100%)', border:'1.5px solid rgba(140,190,255,0.38)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 28px rgba(80,130,220,0.25), inset 0 0 14px rgba(100,160,255,0.08)', backdropFilter:'blur(8px)' }}>
                                  <div style={{ transform:'scale(2.2)', filter:'drop-shadow(0 0 6px rgba(140,190,255,0.80))' }}>
                                    {dept.icon('rgba(160,205,255,0.92)')}
                                  </div>
                                </div>
                              </div>
                              <div style={{ transform:'scale(1.65)', filter:'drop-shadow(0 0 18px rgba(140,190,255,0.55)) drop-shadow(0 0 6px rgba(100,160,255,0.35)) brightness(1.4)', flexShrink:0 }}>
                                {DEPT_ICONS_LARGE[dept.id]?.('140,190,255')}
                              </div>
                              <div style={{ position:'relative', width:96, height:96, flexShrink:0 }}>
                                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:20, height:20, borderRadius:'50%', background:'rgba(140,190,255,0.90)', boxShadow:'0 0 20px rgba(100,160,255,0.65), 0 0 7px rgba(80,140,255,0.40)' }}/>
                                <div style={{ position:'absolute', inset:4, borderRadius:'50%', border:'1.5px solid rgba(140,190,255,0.22)', animation:'hs-spin 4s linear infinite' }}>
                                  <div style={{ position:'absolute', top:-5, left:'50%', marginLeft:-5, width:10, height:10, borderRadius:'50%', background:'rgba(160,205,255,0.92)', boxShadow:'0 0 10px rgba(140,190,255,0.70)' }}/>
                                  <div style={{ position:'absolute', bottom:-5, left:'50%', marginLeft:-5, width:6, height:6, borderRadius:'50%', background:'rgba(100,160,255,0.60)', boxShadow:'0 0 6px rgba(80,140,255,0.50)' }}/>
                                </div>
                                <div style={{ position:'absolute', inset:20, borderRadius:'50%', border:'1px solid rgba(140,190,255,0.32)', animation:'hs-spin-rev 2.5s linear infinite' }}>
                                  <div style={{ position:'absolute', top:-4, left:'50%', marginLeft:-4, width:8, height:8, borderRadius:'50%', background:'rgba(160,205,255,0.85)', boxShadow:'0 0 8px rgba(140,190,255,0.65)' }}/>
                                </div>
                                <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle, rgba(80,130,220,0.12) 0%, transparent 65%)', borderRadius:'50%', animation:'hs-ping 3.2s ease-in-out infinite' }}/>
                              </div>
                            </div>
                            {isExpanded && (
                              <p style={{ position:'absolute', bottom:90, left:24, right:24, margin:0, textAlign:'left', fontSize:'0.80rem', lineHeight:1.90, letterSpacing:'0.03em', fontFamily:"'Inter',sans-serif", fontWeight:500, background:'linear-gradient(90deg, #c8c0b0 0%, #ede8df 18%, #ffffff 32%, #f8f4ee 42%, #ffffff 50%, #f0ebe2 58%, #ffffff 68%, #ede8df 82%, #c8c0b0 100%)', backgroundSize:'250% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'hs-shine 6s linear infinite', filter:'drop-shadow(0 0 8px rgba(255,252,245,0.30))', zIndex:2, pointerEvents:'none' }}>
                                {typedDef}
                                {isTyping && <span className="hs-type-cursor" style={{ color:'rgba(160,205,255,1)', WebkitTextFillColor:'rgba(160,205,255,1)' }}/>}
                              </p>
                            )}
                            <div style={{ position:'absolute', bottom:18, left:22, display:'flex', flexDirection:'column', gap:5, pointerEvents:'none' }}>
                              {['SYSTEM ONLINE','AI READY','SECURE LINK'].map((txt,i) => (
                                <div key={i} style={{ display:'flex', alignItems:'center', gap:6, animation:`hs-ticker 2.4s ease-in-out ${i*0.6}s infinite` }}>
                                  <div style={{ width:5, height:5, borderRadius:'50%', background:'rgba(140,190,255,0.90)', boxShadow:'0 0 5px rgba(140,190,255,0.75)' }}/>
                                  <span style={{ fontSize:'0.58rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(160,205,255,0.65)', fontWeight:600 }}>{txt}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
 
                        <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse at 50% 52%, rgba(80,130,220,0.12) 0%, transparent 65%)' }}/>
                        {/* bottom inner glass glow */}
                        <div style={{ position:'absolute', bottom:0, left:'-5%', right:'-5%', height:110, background:'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(180,220,255,0.38) 0%, rgba(140,190,255,0.14) 45%, rgba(100,160,255,0.06) 70%, transparent 100%)', borderRadius:'0', filter:'blur(8px)', pointerEvents:'none' }}/>
                        <div style={{ position:'absolute', bottom:0, left:'6%', right:'6%', height:1.5, background:'linear-gradient(90deg,transparent,rgba(160,210,255,0.45) 20%,rgba(200,230,255,0.85) 50%,rgba(160,210,255,0.45) 80%,transparent)', pointerEvents:'none' }}/>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
 
            {/* ── OPPOSITE GLASS PANEL (separate, right side) ── */}
            {!expandedCard && (
              <div style={{
                position:'absolute',
                right:'32%', bottom:145,
                width: Math.round(PW * 0.46),
                height: Math.round(PH * 0.64),
                zIndex:16,
                transform:`perspective(${RADIUS * 1.1}px) rotateY(-22deg) translateZ(90px)`,
                transformOrigin:'50% 100%',
                background:'rgba(255,255,255,0.015)',
                border:'1px solid rgba(200,225,255,0.10)',
                boxShadow:'0 12px 40px rgba(0,8,40,0.14), inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(180,210,255,0.05), inset -1px 0 0 rgba(255,255,255,0.07)',
                backdropFilter:'blur(1.5px) saturate(100%) brightness(1.05)',
                WebkitBackdropFilter:'blur(1.5px) saturate(100%) brightness(1.05)',
                pointerEvents:'none',
                overflow:'hidden',
              }}>
                <div style={{ position:'absolute', top:0, left:'12%', right:'12%', height:1, background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.26) 55%, rgba(255,255,255,0.10) 80%, transparent)', pointerEvents:'none' }}/>
                <div style={{ position:'absolute', top:'4%', right:0, height:'22%', width:1, background:'linear-gradient(to bottom, transparent, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.09) 70%, transparent)', pointerEvents:'none' }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(142deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 32%, transparent 60%)', pointerEvents:'none' }}/>
                <div style={{ position:'absolute', bottom:0, left:'6%', right:'6%', height:1, background:'linear-gradient(90deg, transparent, rgba(0,10,60,0.16) 40%, rgba(0,10,60,0.20) 50%, rgba(0,10,60,0.16) 60%, transparent)', pointerEvents:'none' }}/>
                <div style={{ position:'absolute', inset:0, padding:'7px 8px 8px', display:'flex', flexDirection:'column', gap:4, zIndex:2, overflow:'hidden' }}>
                  {/* Department-specific mini graph */}
                  <MiniGraph deptId={activeDept.id}/>
                  {/* glass separator */}
                  <div style={{ height:0.5, background:'linear-gradient(90deg,rgba(200,225,255,0.28),transparent 80%)', flexShrink:0 }}/>
                  {/* Dept label — glass ceramic shimmer */}
                  <div style={{ fontSize:'0.56rem', fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase', fontFamily:"'Cinzel',serif", lineHeight:1.2, background:'linear-gradient(110deg,rgba(255,255,255,0.92) 0%,rgba(200,225,255,0.80) 40%,rgba(255,255,255,0.95) 60%,rgba(180,215,255,0.75) 100%)', backgroundSize:'220% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'hs-shine 5s linear infinite', filter:'drop-shadow(0 0 6px rgba(200,225,255,0.35))', flexShrink:0, opacity: briefStep >= 1 ? 1 : 0, transform: briefStep >= 1 ? 'translateY(0)' : 'translateY(4px)', transition:'opacity 0.28s ease, transform 0.28s ease' }}>{activeDept.label}</div>
                  {/* Stats */}
                  <div style={{ display:'flex', flexDirection:'column', gap:3, flexShrink:0 }}>
                    {activeMeta.stats.slice(0,2).map((s,i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:4, opacity: briefStep >= 2 ? 1 : 0, transition:`opacity 0.20s ease ${i*0.08}s` }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(200,225,255,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}><path d={s.d}/></svg>
                        <span style={{ fontSize:'0.52rem', fontWeight:700, color:'rgba(210,230,255,0.90)', fontFamily:"'Inter',sans-serif", letterSpacing:'0.04em' }}>{typedStats[i]}{briefStep >= 2 && typedStats[i].length < s.v.length && <span className="hs-type-cursor" style={{ color:'rgba(200,225,255,0.90)', WebkitTextFillColor:'rgba(200,225,255,0.90)' }}/>}</span>
                      </div>
                    ))}
                  </div>
                  {/* glass separator */}
                  <div style={{ height:0.5, background:'rgba(255,255,255,0.08)', flexShrink:0 }}/>
                  {/* Brief definition — glass frosted text */}
                  <div style={{ fontSize:'0.40rem', lineHeight:1.72, color:'rgba(190,215,255,0.55)', fontFamily:"'Inter',sans-serif", fontWeight:400, letterSpacing:'0.01em', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', flex:1, minHeight:0 }}>{typedBrief}{isBriefTyping && <span className="hs-type-cursor" style={{ color:'rgba(210,230,255,0.85)', WebkitTextFillColor:'rgba(210,230,255,0.85)' }}/>}</div>
                </div>
              </div>
            )}

            {/* ── floor depth fade ── */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:220, zIndex:8, background:'linear-gradient(to bottom, transparent 0%, rgba(1,1,6,0.55) 70%, rgba(1,1,6,0.88) 100%)', pointerEvents:'none' }}/>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* ══ ZOOM TRANSITION — circular wipe from centre ══ */}
      <AnimatePresence>
        {zooming && (
          <motion.div
            key="zoom-wipe"
            initial={{ scale:0.04, borderRadius:'50%', opacity:1 }}
            animate={{ scale:1.15, borderRadius:'0%', opacity:1 }}
            exit={{ opacity:0 }}
            transition={{
              scale:        { duration:0.62, ease:[0.22,1,0.36,1] },
              borderRadius: { duration:0.66, ease:[0.22,1,0.36,1] },
              opacity:      { duration:0.28, ease:'easeIn' },
            }}
            onAnimationComplete={() => {
              if (pendingDept) {
                const d = pendingDept;
                setPendingDept(null);
                setZooming(false);
                pickDept(d);
              }
            }}
            style={{
              position:'fixed', inset:0, zIndex:299,
              background:'linear-gradient(135deg,#010106 0%,#04021c 60%,#060228 100%)',
              transformOrigin:'50% 50%',
              pointerEvents:'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* ══ CODE ENTRY PHASE ══ */}
      <AnimatePresence>
        {phase === 'code' && (
          <motion.div
            initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:18 }}
            transition={{ duration:0.75, delay:0.08, ease:[0.22,1,0.36,1] }}
            style={{ position:'absolute', inset:0, zIndex:30, display:'flex', flexDirection:'column', justifyContent:'center', alignItems: vw < 640 ? 'center' : 'flex-start', padding: vw < 640 ? '0 6vw' : '0 10vw', textAlign: vw < 640 ? 'center' : 'left' }}
          >
            <button className="hs-back" onClick={() => { setPhase('select'); setCode(''); setErrMsg(''); setExpandedCard(null); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <h1 style={{ fontFamily:'Cinzel,serif', fontSize:'clamp(1.3rem,4.5vw,3rem)', fontWeight:400, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8, background:'linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%)', backgroundSize:'300% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'hs-aurora 5s ease infinite' }}>{selDept?.label}</h1>
            <p style={{fontSize:'clamp(0.60rem,1.4vw,0.78rem)', letterSpacing:'0.14em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:vw < 480 ? 18 : 28}}>{selDept?.hint}</p>
            <form className={`hs-cform${shake ? ' hs-shake' : ''}`} onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
              <div style={{position:'relative', display:'inline-flex', alignItems:'center'}}>
                <input ref={inputRef} className={`hs-cinput${errMsg ? ' hs-err' : ''}`} type={showCode ? 'text' : 'password'} value={code} onChange={e => { setCode(e.target.value); setErrMsg(''); }} placeholder="— — — —" maxLength={10} autoComplete="off" spellCheck={false} style={{paddingRight:36}}/>
                <button type="button" onClick={() => setShowCode(v => !v)} style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',padding:4,color:showCode?'#cc0000':'#444',outline:'none'}}>
                  {showCode
                    ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  }
                </button>
              </div>
              <div className={`hs-errmsg${errMsg ? ' vis' : ''}`}>{errMsg || ' '}</div>
              <div className="hs-hint">Press Enter to confirm</div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}