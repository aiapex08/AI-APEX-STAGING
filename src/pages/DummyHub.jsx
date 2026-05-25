import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
 
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
    definition: 'AI-powered cost estimation that generates accurate Bills of Quantities, automates material pricing, and produces competitive tender packages in a fraction of the time. Eliminate guesswork — every scope review is backed by intelligent data, historical benchmarks, and live pricing feeds.',
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
    <div style={{ width:108, height:108, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
      <img
        src="/E_Estimation.png"
        alt="Estimation"
        style={{
          width:100, height:100, objectFit:'contain',
          mixBlendMode:'screen',
          filter:`drop-shadow(0 0 10px rgba(${a},0.75)) drop-shadow(0 0 3px rgba(${a},0.50))`,
          opacity:0.95,
        }}
      />
    </div>
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
 
export default function DummyHub() {
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
  const inputRef                    = useRef(null);
  const [activeIdx, setActiveIdx]   = useState(2);
  const touchStartX                 = useRef(null);
  const scrollLock                  = useRef(false);
 
  React.useEffect(() => {
    clearInterval(typingRef.current);
    if (expandedCard) {
      const full = DEPT_META[expandedCard]?.definition || '';
      setTypedDef('');
      setIsTyping(true);
      let i = 0;
      typingRef.current = setInterval(() => {
        i++;
        setTypedDef(full.slice(0, i));
        if (i >= full.length) { clearInterval(typingRef.current); setIsTyping(false); }
      }, 20);
    } else {
      setTypedDef('');
      setIsTyping(false);
    }
    return () => clearInterval(typingRef.current);
  }, [expandedCard]);
 
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
    if (entered === 'TEST') alert(`Logged into ${selDept.label} successfully!`);
    else doShake('Invalid code (Try "TEST")');
  };
 
  // ── Arc constants ──
  const N       = depts.length;   // 6
  const RADIUS  = 1100;            // px — arc radius
  const PW      = 260;             // panel width  px
  const PH      = 420;             // panel height px
  const STAGE_H = 550;             // stage container height px
 
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
      background:'#010106',
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
          background:linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%);
          background-size:300% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          filter:drop-shadow(0 1px 8px rgba(79,70,229,0.55)); animation:hs-aurora 5s ease infinite;
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
      `}</style>
 
      {/* ══ LAYER 1: FULL-SCREEN AURORA — fully synced with hs-aurora 5s loop ══ */}
      {/* dark base */}
      <div style={{position:'absolute',inset:0,zIndex:0,background:'#010106',pointerEvents:'none'}}/>
      {/* solid dark left half */}
      <div style={{position:'absolute',top:0,left:0,width:'50%',height:'100%',zIndex:0,background:'#010106',pointerEvents:'none'}}/>
 
      {/* ── SYNCED AURORA: right half, zIndex:0 — lives entirely behind the AI bot ── */}
      <div style={{position:'absolute',top:0,right:0,width:'55%',height:'100%',zIndex:0,overflow:'hidden',pointerEvents:'none'}}>
        {/*
          PRIMARY BAND — uses the exact same gradient + hs-aurora 5s ease infinite as the
          "AI APEX HUB" title, so both cycle through cyan → indigo → violet → purple → teal
          in perfect lockstep.
        */}
        <div style={{
          position:'absolute',
          inset:'-15% -5%',                     /* slight bleed so blur doesn't show hard edge */
          background:'linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%)',
          backgroundSize:'300% auto',            /* same as title CSS variable */
          animation:'hs-aurora 5s ease infinite',/* ← identical loop: duration, easing, fill */
          opacity:0.70,
          filter:'blur(55px)',                   /* diffuse so it reads as atmospheric glow */
        }}/>
        {/* secondary warm drift layer — adds depth without breaking the master sync */}
        <div style={{
          position:'absolute', inset:0,
          background:'radial-gradient(ellipse 55% 80% at 22% 50%, rgba(0,229,255,0.20) 0%, transparent 65%)',
          animation:'hs-aurora-drift1 18s ease-in-out infinite',
        }}/>
        {/* secondary cool drift layer */}
        <div style={{
          position:'absolute', inset:0,
          background:'radial-gradient(ellipse 55% 80% at 80% 50%, rgba(168,85,247,0.20) 0%, transparent 65%)',
          animation:'hs-aurora-drift4 24s ease-in-out infinite',
        }}/>
        {/* left-edge feather — blends aurora cleanly into the dark left half */}
        <div style={{position:'absolute',top:0,left:0,width:'28%',height:'100%',background:'linear-gradient(to right,#010106 0%,transparent 100%)',pointerEvents:'none'}}/>
      </div>
 
      {/* global dim overlay */}
      <div style={{position:'absolute',inset:0,zIndex:1,background:'rgba(1,1,6,0.28)',pointerEvents:'none'}}/>
 
      {/* ══ LAYER 2: AI BOT IMAGE — sits above aurora (zIndex:4) ══ */}
      <div style={{position:'absolute',inset:0,zIndex:4,pointerEvents:'none'}}>
        <img src="/AIBOT.png" alt="AI Bot" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',pointerEvents:'none'}}/>
      </div>
 
      {/* ══ LAYER 3: TEXT BRANDING ══ */}
 
      {/* ── NAFFCO wordmark — extreme left ── */}
      <div style={{ position:'absolute', top:22, left:16, zIndex:30, display:'flex', flexDirection:'column', gap:0, animation:'hs-fadeUp 0.5s ease both' }}>
        <div className="hs-topbrand-naffco"><span style={{ fontWeight:900, letterSpacing:'0.18em' }}>NAFFCO</span> <span style={{ fontWeight:400 }}>AI APEX</span></div>
        <div className="hs-topbrand-sub" style={{ marginTop:3 }}>Passion to Protect</div>
      </div>
 
      {/* ── AI APEX HUB title + STATE OF ART — 6% from left ── */}
      <div className="hs-topbrand">
        <h1 className="hs-title" style={{ marginTop:140 }}>AI APEX HUB</h1>
        <p className="hs-state-of-art" style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:7, height:9, borderRadius:'50%', background:'#cc0000', boxShadow:'0 0 6px #cc0000, 0 0 14px rgba(204,0,0,0.55)', flexShrink:0, display:'inline-block' }}/>
          <span style={{ flex:1, height:1, background:'linear-gradient(to right, rgba(204,0,0,0.70) 0%, rgba(255,255,255,0.18) 100%)', display:'inline-block' }}/>
          <span>STATE OF ART</span>
        </p>
      </div>
 
      {/* ── BOTTOM-LEFT LOGO ── */}
      <img src="/logo.png" alt="NAFFCO" style={{
        position:'absolute', bottom:24, left:36, zIndex:30,
        height:32, objectFit:'contain', opacity:0.55,
        filter:'drop-shadow(0 1px 8px rgba(109,40,217,0.35))',
        animation:'hs-fadeUp 0.6s ease both', cursor:'pointer',
      }} onClick={() => alert('Cost Artist Login Prompt!')} />
 
      {/* ── AR VIEWER ── */}
      <button className="hs-ar-btn" onClick={() => alert('AR Viewer Activated!')}>
        <span className="hs-ar-dot"/> AR Viewer
      </button>
 
      {/* ── LEFT SIDE: SMALL CIRCLE + VERTICAL PILL ── */}
      <AnimatePresence>
        {phase === 'select' && !expandedCard && (
          <motion.div
            initial={{ opacity:0, x:-18 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-18 }}
            transition={{ duration:0.4 }}
            style={{ position:'absolute', left:22, top:'50%', transform:'translateY(-50%)', zIndex:32, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}
          >
            {/* prev button */}
            <button onClick={goPrev} style={{ width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.07)', backdropFilter:'blur(14px)', border:'1px solid rgba(255,255,255,0.18)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.62)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            {/* vertical pill */}
            <div style={{ background:'rgba(10,8,26,0.75)', backdropFilter:'blur(28px)', border:'1.2px solid rgba(255,255,255,0.18)', borderRadius:100, padding:'15px 10px', display:'flex', flexDirection:'column', gap:18, alignItems:'center', boxShadow:'0 12px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)' }}>
              {[
                { d:'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10', on:true  },
                { d:'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',   on:false },
                { d:'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z', on:false },
              ].map(({ d, on }, i) => (
                <button key={i} style={{ width:38, height:38, borderRadius:'50%', background: on ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)', border:`1px solid ${on ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color: on ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.42)', transition:'all 0.3s ease', boxShadow: on ? '0 0 12px rgba(255,255,255,0.15)' : 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* ── TOP-RIGHT GRID CIRCLE BUTTON ── */}
      {phase === 'select' && (
        <button onClick={() => alert('Grid View')} style={{ position:'absolute', top:26, right:168, zIndex:42, width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,0.07)', backdropFilter:'blur(14px)', border:'1px solid rgba(255,255,255,0.15)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.58)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
        </button>
      )}
 
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
              top:210, left:0, right:0, bottom:0,
              perspective:`${RADIUS * 1.1}px`,
              perspectiveOrigin:'33% 68%',
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
                    return `translateX(${tx}) rotateY(${rotateY ?? '0deg'}) translateZ(${z ?? '0px'}) scaleX(${sx}) scaleY(${sy})`;
                  }}
                  style={{
                    '--tc': dept.color,
                    position:'absolute',
                    left:'30%', bottom:80,
                    originX:'50%', originY:'50%',
                    borderRadius:'20px',
                    cursor:'pointer', overflow: relIdx === 0 ? 'visible' : 'hidden',
                    backdropFilter: isExpanded ? 'blur(20px) saturate(160%) brightness(1.12)' : 'blur(6px) saturate(130%)',
                    zIndex: isExpanded ? 22 : (expandedCard ? 4 : Math.max(1, 12 - Math.abs(relIdx))),
                  }}
                  initial={false}
                  animate={isExpanded ? {
                    x: -240, rotateY: 0, z: 300,
                    scale: 1,
                    width: 800, height: 450,
                    opacity: 1,
                    background:'rgba(6,16,58,0.72)',
                    border:'1px solid rgba(160,200,255,0.45)',
                    boxShadow:'0 48px 140px rgba(0,4,24,0.85), 0 20px 60px rgba(0,8,48,0.65), 0 6px 20px rgba(0,4,28,0.50), inset 0 2px 0 rgba(220,235,255,0.50), inset 0 -1px 0 rgba(100,160,255,0.18), inset 1px 0 0 rgba(170,205,255,0.30), inset -1px 0 0 rgba(170,205,255,0.25), 0 0 100px rgba(40,100,220,0.30)',
                    transition:{
                      type:'spring', stiffness:280, damping:26, mass:0.80,
                      opacity:{ type:'tween', duration:0.22, ease:'easeOut' },
                      background:{ type:'tween', duration:0.50, ease:[0.22,1,0.36,1] },
                      boxShadow:{ type:'tween', duration:0.55, ease:[0.22,1,0.36,1] },
                      border:{ type:'tween', duration:0.50, ease:[0.22,1,0.36,1] },
                    },
                  } : {
                    x: -(PW / 2), rotateY: angle,
                    z: relIdx === 0 ? 200 : RADIUS * (Math.cos(angle * Math.PI / 180) - 1) * 1.8,
                    scale: relIdx === 0 ? 0.96 : Math.max(0.50, 1 - Math.abs(relIdx) * 0.26),
                    width: PW,
                    height: PH,
                    opacity: isHidden ? 0 : (relIdx === 0 ? 1 : Math.max(0.65, 0.95 - Math.abs(relIdx) * 0.12)),
                    background: 'rgba(8,24,80,0.06)',
                    border: `1px solid rgba(140,185,255,${relIdx === 0 ? 0.16 : Math.max(0.08, 0.14 - Math.abs(relIdx) * 0.02)})`,
                    boxShadow: `0 8px 40px rgba(0,10,60,0.10), inset 0 1px 0 rgba(160,200,255,0.14), inset 0 -1px 0 rgba(100,160,255,0.07), inset 1px 0 0 rgba(140,190,255,0.10), inset -1px 0 0 rgba(140,190,255,0.07), 0 0 18px 3px rgba(30,80,200,0.06)`,
                    transition:{
                      type:'tween', duration:0.55, ease:[0.22,1,0.36,1],
                      opacity:{ duration:0.28, ease:'easeOut' },
                    },
                  }}
                  whileHover={!expandedCard && relIdx !== 0 ? { scale: Math.max(0.50, 1 - Math.abs(relIdx) * 0.26) + 0.04 } : {}}
                  whileTap={!expandedCard ? { scale: relIdx === 0 ? 1.05 : Math.max(0.46, 1 - Math.abs(relIdx) * 0.26) - 0.04 } : {}}
                  onClick={(e) => { e.stopPropagation(); if (isExpanded) { pickDept(dept); } else if (relIdx === 0) { setExpandedCard(dept.id); } else { setActiveIdx(idx); } }}
                >
                  {/* ── VIRTUAL LIGHT EDGES ── */}
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:1.5, zIndex:30, background:`linear-gradient(90deg, transparent 0%, rgba(100,160,255,0.12) 12%, rgba(140,195,255,0.28) 35%, rgba(140,195,255,0.28) 65%, rgba(100,160,255,0.12) 88%, transparent 100%)`, boxShadow:`0 0 5px 1px rgba(80,140,255,0.10)`, animation:'hs-edge-pulse 4s ease-in-out infinite', animationDelay:`${idx * 0.6}s`, pointerEvents:'none' }}/>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, zIndex:30, background:`linear-gradient(90deg, transparent, rgba(80,140,255,0.10) 30%, rgba(100,160,255,0.18) 50%, rgba(80,140,255,0.10) 70%, transparent)`, pointerEvents:'none' }}/>
                  <div style={{ position:'absolute', top:0, left:0, bottom:0, width:1.5, zIndex:30, background:`linear-gradient(to bottom, rgba(120,175,255,0.20) 0%, rgba(80,140,255,0.08) 45%, rgba(60,110,255,0.02) 80%, transparent 100%)`, boxShadow:`2px 0 8px rgba(80,140,255,0.08)`, pointerEvents:'none' }}/>
                  <div style={{ position:'absolute', top:0, right:0, bottom:0, width:1.5, zIndex:30, background:`linear-gradient(to bottom, rgba(100,160,255,0.16) 0%, rgba(70,125,255,0.06) 50%, rgba(50,100,255,0.02) 80%, transparent 100%)`, boxShadow:`-2px 0 8px rgba(80,140,255,0.06)`, pointerEvents:'none' }}/>
                  <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:`radial-gradient(ellipse 80% 50% at 50% 15%, rgba(80,130,255,0.04) 0%, transparent 70%)` }}/>
 
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
                            <div style={{ position:'absolute', top:0, left:0, right:0, height:'50%', background:'linear-gradient(180deg,rgba(120,170,255,0.10) 0%,rgba(80,130,255,0.04) 40%,transparent 100%)', borderRadius:'20px 20px 0 0', pointerEvents:'none' }}/>
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
                            <div style={{ position:'absolute', top:0, left:0, right:0, height:'42%', background:'linear-gradient(180deg,rgba(255,255,255,0.055) 0%,transparent 100%)', borderRadius:'20px 20px 0 0', pointerEvents:'none' }}/>
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
 
                        <div style={{ position:'absolute', top:22, left:22, right:22 }}>
                          <span className="hs-card-label-aurora" style={{ fontSize:'1.8rem' }}>{dept.label}</span>
                        </div>
 
 
                        {/* center icons — white/glass, same for all cards */}
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
 
                        <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse at 50% 52%, rgba(80,130,220,0.12) 0%, transparent 65%)' }}/>
                        {/* bottom inner glass glow */}
                        <div style={{ position:'absolute', bottom:0, left:'-5%', right:'-5%', height:110, background:'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(180,220,255,0.38) 0%, rgba(140,190,255,0.14) 45%, rgba(100,160,255,0.06) 70%, transparent 100%)', borderRadius:'0 0 20px 20px', filter:'blur(8px)', pointerEvents:'none' }}/>
                        <div style={{ position:'absolute', bottom:0, left:'6%', right:'6%', height:1.5, background:'linear-gradient(90deg,transparent,rgba(160,210,255,0.45) 20%,rgba(200,230,255,0.85) 50%,rgba(160,210,255,0.45) 80%,transparent)', pointerEvents:'none' }}/>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
 
            {/* ── floor depth fade ── */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:220, zIndex:8, background:'linear-gradient(to bottom, transparent 0%, rgba(1,1,6,0.55) 70%, rgba(1,1,6,0.88) 100%)', pointerEvents:'none' }}/>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* ══ CODE ENTRY PHASE ══ */}
      <AnimatePresence>
        {phase === 'code' && (
          <motion.div
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
            transition={{ duration:0.4 }}
            style={{ position:'absolute', inset:0, zIndex:30, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-start', padding:'0 10vw' }}
          >
            <button className="hs-back" onClick={() => { setPhase('select'); setCode(''); setErrMsg(''); setExpandedCard(null); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <h1 style={{ fontFamily:'Cinzel,serif', fontSize:'clamp(1.8rem,3.2vw,3rem)', fontWeight:400, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8, background:'linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%)', backgroundSize:'300% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'hs-aurora 5s ease infinite' }}>{selDept?.label}</h1>
            <p style={{fontSize:'0.78rem', letterSpacing:'0.18em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:28}}>{selDept?.hint}</p>
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