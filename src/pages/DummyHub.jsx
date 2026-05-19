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
      ))}
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
    <svg width="100" height="108" viewBox="0 0 100 108" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="4" width="66" height="88" rx="5" stroke={`rgba(${a},0.48)`} strokeWidth="1.8" fill={`rgba(${a},0.05)`}/>
      <path d="M62 4 L78 20 L62 20 Z" fill={`rgba(${a},0.14)`} stroke={`rgba(${a},0.38)`} strokeWidth="1.2"/>
      {[28,42,56,70].map((y,i)=>(
        <line key={i} x1="24" y1={y} x2={i<3?68:52} y2={y}
          stroke={`rgba(${a},0.55)`} strokeWidth="1.8" strokeLinecap="round"
          strokeDasharray="55" style={{ animation:`hs-stroke 1.6s ease ${i*0.28}s forwards` }}/>
      ))}
      <line x1="12" y1="28" x2="78" y2="28" stroke={`rgba(${a},0.80)`} strokeWidth="1.8" strokeLinecap="round"
        style={{ animation:'hs-scan-ln 3s ease-in-out infinite' }}/>
      <circle cx="82" cy="88" r="16" stroke={`rgba(${a},0.45)`} strokeWidth="1.5" fill={`rgba(${a},0.07)`}/>
      <line x1="82" y1="80" x2="82" y2="88" stroke={`rgba(${a},0.75)`} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="82" y1="88" x2="88" y2="94" stroke={`rgba(${a},0.75)`} strokeWidth="1.8" strokeLinecap="round"
        style={{ animation:'hs-tick-hand 2s ease-in-out infinite alternate' }}/>
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
      color:'#f59e0b', a:'245,158,11', b:'234,88,12',
      icon:(c)=>(
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
        </svg>
      ),
    },
    {
      id:'estimation', label:'Estimation', hint:'Enter estimation code',
      color:'#a78bfa', a:'167,139,250', b:'168,85,247',
      icon:(c)=>(
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="8" y1="15" x2="11" y2="15"/>
        </svg>
      ),
    },
    {
      id:'contracts', label:'Contracts', hint:'Enter contracts code',
      color:'#60a5fa', a:'96,165,250', b:'59,130,246',
      icon:(c)=>(
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          <path d="M9 13h6M9 17h4"/>
        </svg>
      ),
    },
    {
      id:'engineering', label:'Engineering', hint:'Enter engineering code',
      color:'#34d399', a:'52,211,153', b:'16,185,129',
      icon:(c)=>(
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M12 2v2M12 20v2M2 12h2M20 12h2"/>
        </svg>
      ),
    },
    {
      id:'salesorder', label:'Sales Order', hint:'Enter sales order code',
      color:'#fb923c', a:'251,146,60', b:'239,68,68',
      icon:(c)=>(
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
      ),
    },
    {
      id:'supplier', label:'Supplier', hint:'Enter supplier code',
      color:'#2dd4bf', a:'45,212,191', b:'20,184,166',
      icon:(c)=>(
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
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
  const ARC     = 70;              // total spread in degrees
  const RADIUS  = 890;            // px — distance from viewer to each panel
  const PW      = 240;            // panel width  px
  const PH      = 510;            // panel height px
  const STAGE_H = 650;            // stage container height px
  const stepAngle = ARC / (N - 1); // 16° per step

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

        /* branding */
        .hs-topbrand { position:absolute; top:22px; left:40px; z-index:30; display:flex; flex-direction:column; gap:2px; animation:hs-fadeUp 0.5s ease both; }
        .hs-topbrand-naffco {
          font-size:clamp(0.78rem,1vw,0.95rem); font-weight:500; letter-spacing:0.28em;
          text-transform:uppercase; line-height:1;
          background:linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%);
          background-size:300% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          filter:drop-shadow(0 1px 8px rgba(79,70,229,0.55)); animation:hs-aurora 5s ease infinite;
        }
        .hs-topbrand-sub { font-size:clamp(0.52rem,0.65vw,0.62rem); font-weight:400; letter-spacing:0.38em; text-transform:uppercase; color:rgba(255,255,255,0.28); margin-bottom:10px; }
        .hs-title {
          font-family:'Cinzel',serif; font-size:clamp(3.2rem,6vw,6rem); font-weight:400; letter-spacing:0.08em; text-transform:uppercase; line-height:1.1; margin-bottom:6px;
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
        .hs-ar-btn { position:absolute; bottom:24px; right:24px; z-index:40; display:inline-flex; align-items:center; gap:7px; background:rgba(0,0,0,0.45); border:1px solid rgba(255,255,255,0.20); border-radius:100px; padding:7px 16px; cursor:pointer; color:rgba(255,255,255,0.82); font-size:0.70rem; font-weight:600; letter-spacing:0.10em; text-transform:uppercase; transition:background 0.2s,border-color 0.2s,color 0.2s,box-shadow 0.2s; }
        .hs-ar-btn:hover { background:rgba(0,200,255,0.12); border-color:rgba(0,200,255,0.45); color:#fff; box-shadow:0 0 16px rgba(0,200,255,0.22); }
        .hs-ar-dot { width:6px; height:6px; border-radius:50%; background:#00cfff; box-shadow:0 0 6px #00cfff; }
      `}</style>

      {/* ── FULL-SCREEN BACKGROUND: aurora + robot ── */}
      <div style={{position:'absolute',inset:0,zIndex:0}}>
        <div style={{position:'absolute',top:'-10%',left:0,right:0,bottom:'-5%',
          background:'radial-gradient(ellipse at 30% 25%, rgba(99,102,241,0.38) 0%, transparent 52%), radial-gradient(ellipse at 72% 72%, rgba(109,40,217,0.22) 0%, transparent 48%)',
          filter:'blur(55px)',opacity:1}}/>
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,
          background:'radial-gradient(ellipse at 50% 42%, rgba(30,27,110,0.32) 0%, transparent 62%)',
          filter:'blur(28px)',opacity:1}}/>
        <img src="/AIBOT.png" alt="AI Bot" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',pointerEvents:'none'}}/>
      </div>

      {/* ── TOP-LEFT BRANDING ── */}
      <div className="hs-topbrand">
        <div className="hs-topbrand-naffco">NAFFCO AI APEX</div>
        <div className="hs-topbrand-sub">Passion to Protect</div>
        <h1 className="hs-title">AI APEX HUB</h1>
        <p className="hs-state-of-art">— STATE OF ART —</p>
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
            <div style={{ background:'rgba(10,8,26,0.68)', backdropFilter:'blur(22px)', border:'1px solid rgba(255,255,255,0.11)', borderRadius:100, padding:'13px 8px', display:'flex', flexDirection:'column', gap:16, alignItems:'center', boxShadow:'0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)' }}>
              {[
                { d:'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10', on:true  },
                { d:'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',   on:false },
                { d:'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z', on:false },
              ].map(({ d, on }, i) => (
                <button key={i} style={{ width:34, height:34, borderRadius:'50%', background: on ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.04)', border:`1px solid ${on ? 'rgba(255,255,255,0.24)' : 'rgba(255,255,255,0.08)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color: on ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.36)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
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




      {/* ══════════════════════════════════════════
          SELECT PHASE — PANORAMIC ARC STAGE
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === 'select' && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.5 }}
            onWheel={onWheel}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{
              position:'absolute',
              top:210, left:0, right:0, bottom:0,
              /* 3-D perspective — viewer inside the arc */
              perspective:`${RADIUS * 1.1}px`,
              perspectiveOrigin:'33% 35%',
              zIndex:20,
            }}
          >
            {/* ── outside-click dismiss overlay ── */}
            {expandedCard && (
              <div
                onClick={() => setExpandedCard(null)}
                style={{ position:'fixed', inset:0, zIndex:8, cursor:'default' }}
              />
            )}

            {/* ── arc panels ── */}
            {depts.map((dept, idx) => {
              const relIdx     = idx - activeIdx;
              const angle      = relIdx * stepAngle;
              const isExpanded = expandedCard === dept.id;
              const isHidden   = expandedCard && !isExpanded;
              const floats     = FLOATS[dept.id] || [];

              return (
                <motion.div
                  key={dept.id}
                  className="hs-panel"
                  /* Fix transform order: rotateY THEN translateZ creates the proper cylinder arc */
                  transformTemplate={({ x, rotateY, z, scaleX, scaleY }) =>
                    `translateX(${x ?? '-50%'}) scaleX(${scaleX ?? 1}) scaleY(${scaleY ?? 1}) rotateY(${rotateY ?? '0deg'}) translateZ(${z ?? '0px'})`
                  }
                  style={{
                    '--tc': dept.color,
                    position:'absolute',
                    left:'33%', bottom:120,
                    originX:'50%', originY:'50%',
                    borderRadius:'18px 18px 0 0',
                    cursor:'pointer', overflow:'hidden',
                    backdropFilter: isExpanded
                      ? 'blur(28px) saturate(160%) brightness(1.08)'
                      : `blur(${relIdx === 0 ? 18 : 12}px) saturate(140%) brightness(1.05)`,
                    zIndex: isExpanded ? 15 : Math.max(1, 12 - Math.abs(relIdx)),
                  }}
                  initial={false}
                  animate={isExpanded ? {
                    x: -240, rotateY: 0, z: 150,
                    width: 800, height: 500,
                    opacity: 1,
                    background:`linear-gradient(160deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.02) 60%, rgba(4,3,22,0.18) 100%)`,
                    border:`1px solid rgba(255,255,255,0.32)`,
                    boxShadow:`0 32px 80px rgba(0,0,0,0.42), 0 8px 24px rgba(0,0,0,0.28), inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(255,255,255,0.10), inset 1px 0 0 rgba(255,255,255,0.22), inset -1px 0 0 rgba(255,255,255,0.12), 0 0 80px rgba(${dept.a},0.14)`,
} : {
  x:'-50%', rotateY: -angle,
  z: -RADIUS + (relIdx === 0 ? 520 : Math.max(0, 200 - Math.abs(relIdx) * 80)),
  width: relIdx === 0 ? 320 : Math.max(160, PW - Math.abs(relIdx) * 22),
  height: relIdx === 0 ? 550 : Math.max(340, PH - Math.abs(relIdx) * 28),
  opacity: isHidden ? 0 : Math.max(0.18, 1 - Math.abs(relIdx) * 0.25),
  background: relIdx === 0
    ? `linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.02) 60%, rgba(6,4,24,0.22) 100%)`
    : `linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 32%, rgba(255,255,255,0.01) 65%, rgba(6,4,24,0.32) 100%)`,
  border: relIdx === 0
    ? `1px solid rgba(255,255,255,0.38)`
    : `1px solid rgba(255,255,255,0.20)`,
  boxShadow: relIdx === 0
    ? `0 32px 92px rgba(0,0,0,0.45), 0 8px 20px rgba(0,0,0,0.28), inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(255,255,255,0.10), inset 1px 0 0 rgba(255,255,255,0.22), inset -1px 0 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(255,255,255,0.05)`
    : `0 14px 38px rgba(0,0,0,0.32), inset 0 2px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(255,255,255,0.06), inset 1px 0 0 rgba(255,255,255,0.14), inset -1px 0 0 rgba(255,255,255,0.07)`,
}}
                  transition={{ type:'spring', stiffness:200, damping:28, opacity:{ duration:0.25 } }}
                  whileHover={!expandedCard ? { scale:1.06 } : {}}
                  whileTap={!expandedCard ? { scale:0.95 } : {}}
                  onClick={(e) => { e.stopPropagation(); if (isExpanded) { pickDept(dept); } else if (relIdx === 0) { setExpandedCard(dept.id); } else { setActiveIdx(idx); } }}
                >
                  {/* sweeping sheen */}
                  <div style={{
                    position:'absolute', top:0, width:'55%', height:'100%',
                    background:'linear-gradient(108deg,transparent 0%,rgba(255,255,255,0.055) 50%,transparent 100%)',
                    animation:'cardSweep 6s ease-in-out infinite',
                    animationDelay:`${-(idx*0.75).toFixed(2)}s`, pointerEvents:'none',
                  }}/>
                  {/* ── GLASS EDGES ── */}

                  {/* TOP EDGE — bright specular line + glow */}
                  <div style={{
                    position:'absolute', top:0, left:0, right:0, height:2, zIndex:2,
                    background:`linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 8%, rgba(255,255,255,1) 28%, rgba(255,255,255,1) 72%, rgba(255,255,255,0.55) 92%, transparent 100%)`,
                    boxShadow:`0 0 10px 3px rgba(255,255,255,0.45), 0 0 28px 6px rgba(255,255,255,0.14)`,
                    animation:'hs-edge-pulse 4s ease-in-out infinite',
                    pointerEvents:'none',
                  }}/>

                  {/* BOTTOM EDGE — subtle secondary catch */}
                  <div style={{
                    position:'absolute', bottom:0, left:0, right:0, height:1, zIndex:2,
                    background:`linear-gradient(90deg, transparent, rgba(255,255,255,0.22) 25%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0.22) 75%, transparent)`,
                    pointerEvents:'none',
                  }}/>

                  {/* LEFT EDGE — bright highlight fading down */}
                  <div style={{
                    position:'absolute', top:0, left:0, bottom:0, width:2, zIndex:2,
                    background:`linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.50) 25%, rgba(255,255,255,0.18) 60%, transparent 100%)`,
                    boxShadow:`2px 0 12px rgba(255,255,255,0.20)`,
                    pointerEvents:'none',
                  }}/>

                  {/* RIGHT EDGE — softer refraction */}
                  <div style={{
                    position:'absolute', top:0, right:0, bottom:0, width:1.5, zIndex:2,
                    background:`linear-gradient(to bottom, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.22) 35%, rgba(255,255,255,0.08) 70%, transparent 100%)`,
                    pointerEvents:'none',
                  }}/>

                  {/* INNER BEVEL — glass thickness top */}
                  <div style={{
                    position:'absolute', top:4, left:4, right:4, height:1, zIndex:2,
                    background:`linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 20%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.18) 80%, transparent)`,
                    pointerEvents:'none',
                  }}/>

                  {/* INNER BEVEL — glass thickness left */}
                  <div style={{
                    position:'absolute', top:4, left:4, bottom:4, width:1, zIndex:2,
                    background:`linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0.06) 55%, transparent)`,
                    pointerEvents:'none',
                  }}/>

                  {/* CORNER GLINT — top-left */}
                  <div style={{
                    position:'absolute', top:-1, left:-1, width:14, height:14, zIndex:4,
                    background:`radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.55) 35%, transparent 70%)`,
                    animation:`hs-corner-flash ${3.2 + idx * 0.3}s ease-in-out infinite`,
                    pointerEvents:'none',
                  }}/>

                  {/* CORNER GLINT — top-right */}
                  <div style={{
                    position:'absolute', top:-1, right:-1, width:12, height:12, zIndex:4,
                    background:`radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 40%, transparent 70%)`,
                    animation:`hs-corner-flash ${3.2 + idx * 0.3}s ease-in-out ${1.4}s infinite`,
                    pointerEvents:'none',
                  }}/>

                  {/* CORNER GLINT — bottom-left */}
                  <div style={{
                    position:'absolute', bottom:-1, left:-1, width:8, height:8, zIndex:4,
                    background:`radial-gradient(circle, rgba(255,255,255,0.50) 0%, transparent 70%)`,
                    animation:`hs-corner-flash ${3.6 + idx * 0.3}s ease-in-out ${0.7}s infinite`,
                    pointerEvents:'none',
                  }}/>

                  {/* TRAVELING GLINT — slides along top edge */}
                  <div style={{
                    position:'absolute', top:-1, width:'22%', height:4, zIndex:3,
                    background:`linear-gradient(90deg, transparent, rgba(255,255,255,0.90) 40%, rgba(255,255,255,0.90) 60%, transparent)`,
                    filter:`blur(1.5px)`,
                    animation:`hs-glint ${5 + idx * 0.7}s ease-in-out ${idx * 0.55}s infinite`,
                    pointerEvents:'none',
                  }}/>

                  {/* glass inner top highlight */}
                  <div style={{
                    position:'absolute', top:0, left:0, right:0, height: isExpanded ? 100 : 70, zIndex:1,
                    background:`linear-gradient(to bottom, rgba(255,255,255,0.10) 0%, transparent 100%)`,
                    pointerEvents:'none',
                  }}/>

                  {/* glass color tint vignette */}
                  <div style={{
                    position:'absolute', inset:0, zIndex:1,
                    background:`radial-gradient(ellipse at 30% 20%, rgba(${dept.a},0.10) 0%, transparent 60%)`,
                    pointerEvents:'none',
                  }}/>

                  {/* ── NORMAL card face ── */}
                  <AnimatePresence>
                    {!isExpanded && (
                      <motion.div
                        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        transition={{ duration:0.25 }}
                        style={{ position:'absolute', inset:0 }}
                      >
                        {/* glass background — light specular highlight */}
                        <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 28%, transparent 55%)' }}/>
                        {/* active aurora top line */}
                        {relIdx === 0 && (
                          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#06b6d4 20%,#4f46e5 45%,#a855f7 65%,#06b6d4 80%,transparent)', backgroundSize:'300% auto', animation:'hs-aurora 4s ease infinite', boxShadow:'0 0 10px rgba(6,182,212,0.65)', pointerEvents:'none' }}/>
                        )}
                        {/* large animated dept icon — covers upper half */}
                        <div style={{ position:'absolute', top:'8%', left:'50%', transform:'translateX(-50%) scale(1.35)', pointerEvents:'none', display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'56%', filter:`drop-shadow(0 0 18px rgba(${dept.a},0.75)) drop-shadow(0 0 6px rgba(${dept.a},0.50)) brightness(1.5)` }}>
                          {DEPT_ICONS_LARGE[dept.id]?.(dept.a)}
                        </div>
                        {/* bottom: fade + name + aurora dots */}
                        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'38px 12px 11px', background:'linear-gradient(to top, rgba(2,2,20,0.97) 0%, rgba(2,2,20,0.55) 55%, transparent 100%)', pointerEvents:'none' }}>
                          <div className={relIdx === 0 ? 'hs-card-label-aurora' : 'hs-card-label'} style={{ marginBottom:5 }}>{dept.label}</div>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                            <span style={{ fontSize:'0.60rem', color:'rgba(255,255,255,0.50)', letterSpacing:'0.14em', textTransform:'uppercase' }}>AI Module</span>
                            <div style={{ display:'flex', gap:4 }}>
                              {['#00e5ff','#7c3aed','#a855f7'].map((c,i) => (
                                <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:c, opacity: relIdx===0 ? (i===0?1:0.5) : 0.2, boxShadow: relIdx===0 && i===0 ? `0 0 7px ${c}` : 'none' }}/>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── EXPANDED content: floating icons ── */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        transition={{ duration:0.35, delay:0.15 }}
                        style={{ position:'absolute', inset:0 }}
                      >

                        {/* ── FUTURISTIC BACKGROUND LAYER ── */}
                        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>

                          {/* circuit board traces */}
                          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.18 }} viewBox="0 0 800 500" preserveAspectRatio="none">
                            {/* horizontal traces */}
                            {[60,130,200,280,360,430].map((y,i) => (
                              <line key={`h${i}`} x1="0" y1={y} x2="800" y2={y}
                                stroke={`rgba(${dept.a},1)`} strokeWidth="0.6"
                                strokeDasharray="12 28"
                                style={{ animation:`hs-data-blink ${2.2+i*0.4}s ease-in-out ${i*0.3}s infinite` }}/>
                            ))}
                            {/* vertical traces */}
                            {[80,180,310,460,580,700].map((x,i) => (
                              <line key={`v${i}`} x1={x} y1="0" x2={x} y2="500"
                                stroke={`rgba(${dept.a},1)`} strokeWidth="0.6"
                                strokeDasharray="8 32"
                                style={{ animation:`hs-data-blink ${2.6+i*0.35}s ease-in-out ${i*0.25}s infinite` }}/>
                            ))}
                            {/* circuit node dots at intersections */}
                            {[[80,60],[180,130],[310,200],[460,280],[580,360],[700,60],[80,360],[460,130],[180,430]].map(([x,y],i) => (
                              <circle key={`n${i}`} cx={x} cy={y} r="3"
                                fill={`rgba(${dept.a},0.9)`}
                                style={{ animation:`hs-node-pulse ${1.8+i*0.25}s ease-in-out ${i*0.4}s infinite` }}/>
                            ))}
                            {/* L-shaped circuit paths */}
                            <path d="M80,60 L80,130 L180,130" stroke={`rgba(${dept.a},0.8)`} strokeWidth="1" fill="none"
                              strokeDasharray="200" style={{ animation:'hs-circuit 3s ease 0.5s forwards' }}/>
                            <path d="M460,280 L460,360 L580,360 L580,430" stroke={`rgba(${dept.a},0.8)`} strokeWidth="1" fill="none"
                              strokeDasharray="300" style={{ animation:'hs-circuit 3.5s ease 0.8s forwards' }}/>
                            <path d="M700,60 L700,200 L580,200 L580,130" stroke={`rgba(${dept.a},0.7)`} strokeWidth="1" fill="none"
                              strokeDasharray="350" style={{ animation:'hs-circuit 4s ease 1.2s forwards' }}/>
                            <path d="M310,430 L180,430 L180,360 L80,360" stroke={`rgba(${dept.a},0.7)`} strokeWidth="1" fill="none"
                              strokeDasharray="300" style={{ animation:'hs-circuit 3.8s ease 1.0s forwards' }}/>
                          </svg>

                          {/* vertical scan line */}
                          <div style={{
                            position:'absolute', left:0, right:0, height:1,
                            background:`linear-gradient(90deg, transparent 0%, rgba(${dept.a},0.0) 10%, rgba(${dept.a},0.7) 50%, rgba(${dept.a},0.0) 90%, transparent 100%)`,
                            boxShadow:`0 0 12px rgba(${dept.a},0.5)`,
                            animation:'hs-scan-v 4s ease-in-out infinite',
                          }}/>

                          {/* hexagon ring top-right */}
                          <svg style={{ position:'absolute', top:-30, right:-30, opacity:0.12, animation:'hs-hex-rot 18s linear infinite' }} width="160" height="160" viewBox="0 0 160 160">
                            <polygon points="80,10 142,45 142,115 80,150 18,115 18,45" fill="none" stroke={`rgba(${dept.a},1)`} strokeWidth="1"/>
                            <polygon points="80,28 126,53 126,107 80,132 34,107 34,53" fill="none" stroke={`rgba(${dept.a},0.7)`} strokeWidth="0.8"/>
                            <polygon points="80,46 110,62 110,98 80,114 50,98 50,62" fill="none" stroke={`rgba(${dept.a},0.5)`} strokeWidth="0.6"/>
                          </svg>

                          {/* hexagon ring bottom-left */}
                          <svg style={{ position:'absolute', bottom:-20, left:-20, opacity:0.10, animation:'hs-hex-rot 24s linear reverse infinite' }} width="120" height="120" viewBox="0 0 120 120">
                            <polygon points="60,8 108,34 108,86 60,112 12,86 12,34" fill="none" stroke={`rgba(${dept.a},1)`} strokeWidth="1"/>
                            <polygon points="60,24 92,42 92,78 60,96 28,78 28,42" fill="none" stroke={`rgba(${dept.a},0.6)`} strokeWidth="0.7"/>
                          </svg>

                          {/* floating AI particles */}
                          {[
                            {x:'15%',d:'0s',sz:4},{x:'72%',d:'0.8s',sz:3},{x:'42%',d:'1.4s',sz:5},
                            {x:'88%',d:'0.4s',sz:3},{x:'28%',d:'1.9s',sz:4},{x:'60%',d:'2.3s',sz:3},
                          ].map((p,i) => (
                            <div key={i} style={{
                              position:'absolute', bottom:'12%', left:p.x,
                              width:p.sz, height:p.sz, borderRadius:'50%',
                              background:`rgba(${dept.a},0.9)`,
                              boxShadow:`0 0 ${p.sz*3}px rgba(${dept.a},0.8)`,
                              animation:`hs-particle-up ${3+i*0.5}s ease-out ${p.d} infinite`,
                            }}/>
                          ))}

                          {/* corner bracket — top left */}
                          <svg style={{ position:'absolute', top:8, left:8, opacity:0.55 }} width="36" height="36" viewBox="0 0 36 36">
                            <path d="M2,18 L2,2 L18,2" fill="none" stroke={`rgba(${dept.a},1)`} strokeWidth="1.5" strokeLinecap="round"
                              strokeDasharray="60" style={{ animation:'hs-circuit 1.5s ease forwards' }}/>
                          </svg>
                          {/* corner bracket — bottom right */}
                          <svg style={{ position:'absolute', bottom:8, right:8, opacity:0.55 }} width="36" height="36" viewBox="0 0 36 36">
                            <path d="M34,18 L34,34 L18,34" fill="none" stroke={`rgba(${dept.a},1)`} strokeWidth="1.5" strokeLinecap="round"
                              strokeDasharray="60" style={{ animation:'hs-circuit 1.5s ease 0.4s forwards' }}/>
                          </svg>

                          {/* neural net mini — bottom right area */}
                          <svg style={{ position:'absolute', bottom:55, right:30, opacity:0.22 }} width="110" height="90" viewBox="0 0 110 90">
                            {[[15,20],[15,70],[55,10],[55,45],[55,80],[95,30],[95,60]].map(([x,y],i) => (
                              <circle key={i} cx={x} cy={y} r="4" fill={`rgba(${dept.a},1)`}
                                style={{ animation:`hs-node-pulse ${1.6+i*0.3}s ease-in-out ${i*0.35}s infinite` }}/>
                            ))}
                            {[[15,20,55,10],[15,20,55,45],[15,70,55,45],[15,70,55,80],[55,10,95,30],[55,45,95,30],[55,45,95,60],[55,80,95,60]].map(([x1,y1,x2,y2],i) => (
                              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke={`rgba(${dept.a},0.55)`} strokeWidth="0.8"
                                style={{ animation:`hs-data-blink ${2+i*0.2}s ease-in-out ${i*0.2}s infinite` }}/>
                            ))}
                          </svg>

                        </div>

                        {/* dept label */}
                        <div style={{
                          position:'absolute', top:22, left:22, right:22,
                          fontFamily:"'Cinzel',serif",
                          fontSize:'1.8rem', fontWeight:700, letterSpacing:'0.08em',
                          textTransform:'uppercase',
                        }}>
                          <span className="hs-card-label-aurora" style={{ fontSize:'1.8rem' }}>{dept.label}</span>
                        </div>

                        {/* ── corner floating mini-icons ── */}
                        {floats.slice(0,4).map((fi, i) => (
                          <motion.div key={i} style={{
                            position:'absolute', left:`${fi.x}%`, top:`${fi.y}%`,
                            color:`rgba(${dept.a},0.55)`,
                            filter:`drop-shadow(0 0 6px rgba(${dept.a},0.5))`,
                            pointerEvents:'none',
                          }}
                            animate={{ y:[-8,8,-8], x:[-3,3,-3], rotate:[-5,5,-5], opacity:[0.35,0.7,0.35] }}
                            transition={{ duration:fi.dur, delay:fi.delay, repeat:Infinity, ease:'easeInOut' }}
                          >
                            <svg width={fi.sz*0.75} height={fi.sz*0.75} viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                              <path d={fi.d}/>
                            </svg>
                          </motion.div>
                        ))}

                        {/* ── CENTER: 3 BIG ANIMATIONS ── */}
                        <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-60%)', display:'flex', alignItems:'center', gap:36, pointerEvents:'none', zIndex:2 }}>

                            {/* ANIMATION 1 — pulsing orb with dept icon */}
                            <div style={{ position:'relative', width:96, height:96, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                              {[0,1,2].map(i => (
                                <div key={i} style={{
                                  position:'absolute', inset: i * -14,
                                  borderRadius:'50%',
                                  border:`1.5px solid rgba(${dept.a},${0.55 - i * 0.16})`,
                                  animation:`hs-ping 2.8s ease-in-out ${i * 0.55}s infinite`,
                                }}/>
                              ))}
                              <div style={{
                                width:64, height:64, borderRadius:'50%',
                                background:`radial-gradient(circle, rgba(${dept.a},0.22) 0%, rgba(${dept.a},0.06) 60%, transparent 100%)`,
                                border:`1.5px solid rgba(${dept.a},0.55)`,
                                display:'flex', alignItems:'center', justifyContent:'center',
                                boxShadow:`0 0 32px rgba(${dept.a},0.65), inset 0 0 18px rgba(${dept.a},0.12)`,
                                backdropFilter:'blur(8px)',
                              }}>
                                <div style={{ transform:'scale(2.2)', filter:`drop-shadow(0 0 8px rgba(${dept.a},1))` }}>
                                  {dept.icon(dept.color)}
                                </div>
                              </div>
                            </div>

                            {/* ANIMATION 2 — MAIN: DEPT_ICONS_LARGE big & glowing */}
                            <div style={{
                              transform:'scale(1.65)',
                              filter:`drop-shadow(0 0 22px rgba(${dept.a},0.90)) drop-shadow(0 0 8px rgba(${dept.a},0.60)) brightness(1.7)`,
                              flexShrink:0,
                            }}>
                              {DEPT_ICONS_LARGE[dept.id]?.(dept.a)}
                            </div>

                            {/* ANIMATION 3 — dual orbit rings */}
                            <div style={{ position:'relative', width:96, height:96, flexShrink:0 }}>
                              {/* core */}
                              <div style={{
                                position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                                width:20, height:20, borderRadius:'50%',
                                background:`rgba(${dept.a},0.95)`,
                                boxShadow:`0 0 24px rgba(${dept.a},1), 0 0 8px rgba(${dept.a},0.6)`,
                              }}/>
                              {/* outer ring */}
                              <div style={{
                                position:'absolute', inset:4, borderRadius:'50%',
                                border:`1.5px solid rgba(${dept.a},0.28)`,
                                animation:'hs-spin 4s linear infinite',
                              }}>
                                <div style={{ position:'absolute', top:-5, left:'50%', marginLeft:-5, width:10, height:10, borderRadius:'50%', background:`rgba(${dept.a},1)`, boxShadow:`0 0 12px rgba(${dept.a},1)` }}/>
                                <div style={{ position:'absolute', bottom:-5, left:'50%', marginLeft:-5, width:6, height:6, borderRadius:'50%', background:`rgba(${dept.a},0.6)`, boxShadow:`0 0 8px rgba(${dept.a},0.8)` }}/>
                              </div>
                              {/* inner ring */}
                              <div style={{
                                position:'absolute', inset:20, borderRadius:'50%',
                                border:`1px solid rgba(${dept.a},0.45)`,
                                animation:'hs-spin-rev 2.5s linear infinite',
                              }}>
                                <div style={{ position:'absolute', top:-4, left:'50%', marginLeft:-4, width:8, height:8, borderRadius:'50%', background:`rgba(${dept.a},0.9)`, boxShadow:`0 0 10px rgba(${dept.a},0.9)` }}/>
                              </div>
                              {/* glow disc */}
                              <div style={{
                                position:'absolute', inset:0,
                                background:`radial-gradient(circle, rgba(${dept.a},0.14) 0%, transparent 65%)`,
                                borderRadius:'50%', animation:`hs-ping 3.2s ease-in-out infinite`,
                              }}/>
                            </div>
                          </div>

                        {/* typewriter definition — pinned above status ticker */}
                        {isExpanded && (
                          <p style={{
                            position:'absolute', bottom:90, left:24, right:24,
                            margin:0, textAlign:'left',
                            fontSize:'0.80rem', lineHeight:1.90,
                            letterSpacing:'0.03em',
                            fontFamily:"'Inter',sans-serif", fontWeight:500,
                            background:'linear-gradient(90deg, #c8c0b0 0%, #ede8df 18%, #ffffff 32%, #f8f4ee 42%, #ffffff 50%, #f0ebe2 58%, #ffffff 68%, #ede8df 82%, #c8c0b0 100%)',
                            backgroundSize:'250% auto',
                            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                            backgroundClip:'text',
                            animation:'hs-shine 6s linear infinite',
                            filter:'drop-shadow(0 0 8px rgba(255,252,245,0.30))',
                            zIndex:2, pointerEvents:'none',
                          }}>
                            {typedDef}
                            {isTyping && <span className="hs-type-cursor" style={{ color:`rgba(${dept.a},1)`, WebkitTextFillColor:`rgba(${dept.a},1)` }}/>}
                          </p>
                        )}

                        {/* status ticker bottom-left */}
                        <div style={{
                          position:'absolute', bottom:18, left:22,
                          display:'flex', flexDirection:'column', gap:5, pointerEvents:'none',
                        }}>
                          {['SYSTEM ONLINE','AI READY','SECURE LINK'].map((txt,i) => (
                            <div key={i} style={{
                              display:'flex', alignItems:'center', gap:6,
                              animation:`hs-ticker 2.4s ease-in-out ${i*0.6}s infinite`,
                            }}>
                              <div style={{
                                width:5, height:5, borderRadius:'50%',
                                background:`rgba(${dept.a},0.9)`,
                                boxShadow:`0 0 6px rgba(${dept.a},1)`,
                              }}/>
                              <span style={{
                                fontSize:'0.58rem', letterSpacing:'0.22em', textTransform:'uppercase',
                                color:`rgba(${dept.a},0.75)`, fontWeight:600,
                              }}>{txt}</span>
                            </div>
                          ))}
                        </div>

                        {/* radial glow */}
                        <div style={{
                          position:'absolute', inset:0, pointerEvents:'none',
                          background:`radial-gradient(ellipse at 50% 52%, rgba(${dept.a},0.18) 0%, transparent 65%)`,
                        }}/>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* ── glossy floor seam ── */}
            <div style={{
              position:'absolute', bottom:0, left:0, right:0, height:1.5, zIndex:5,
              background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.08) 10%,rgba(255,255,255,0.30) 35%,rgba(255,255,255,0.30) 65%,rgba(255,255,255,0.08) 90%,transparent 100%)',
              boxShadow:'0 0 22px 2px rgba(255,255,255,0.10)',
            }}/>

            {/* ── floor glass light columns ── */}
            {depts.map((dept, idx) => {
              const angle   = (idx - activeIdx) * stepAngle;
              const xPct    = 50 + Math.sin(angle * Math.PI / 180) * 30;
              const isActive = idx === activeIdx;
              return (
                <div key={`lc-${dept.id}`} style={{
                  position:'absolute', bottom:0, zIndex:3,
                  left:`${xPct}%`, transform:'translateX(-50%)',
                  width: isActive ? 110 : 70,
                  height: isActive ? 230 : 170,
                  background: isActive
                    ? 'radial-gradient(ellipse at top, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 50%, transparent 100%)'
                    : 'radial-gradient(ellipse at top, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 55%, transparent 100%)',
                  filter:'blur(14px)', pointerEvents:'none',
                }}/>
              );
            })}

            {/* ── floor mirror reflection ── */}
            {depts.map((dept, idx) => {
              const relIdx = idx - activeIdx;
              const angle  = relIdx * stepAngle;
              const xPct   = 50 + Math.sin(angle * Math.PI / 180) * 28;
              const scaleX = Math.cos(angle * Math.PI / 180);
              const cardW  = relIdx === 0 ? 320 : Math.max(160, PW - Math.abs(relIdx) * 22);
              const refH   = relIdx === 0 ? 200 : Math.max(100, 160 - Math.abs(relIdx) * 18);
              const refOpacity = Math.max(0.12, 0.72 - Math.abs(relIdx) * 0.20);
              return (
                <div key={`rf-${dept.id}`} style={{
                  position:'absolute', bottom:0, zIndex:7,
                  left:`${xPct}%`,
                  transform:`translateX(-50%) scaleX(${scaleX.toFixed(3)})`,
                  width:cardW, height:refH,
                  overflow:'hidden', pointerEvents:'none',
                  opacity: refOpacity,
                }}>
                  {/* mirrored card body — scaleY(-1) flips it upside-down */}
                  <div style={{
                    position:'absolute', top:0, left:0, right:0, bottom:0,
                    transform:'scaleY(-1)', transformOrigin:'top center',
                    background: relIdx === 0
                      ? `linear-gradient(160deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.08) 60%, rgba(6,4,24,0.42) 100%)`
                      : `linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.10) 35%, rgba(255,255,255,0.04) 65%, rgba(6,4,24,0.55) 100%)`,
                    border:`1px solid rgba(255,255,255,${relIdx === 0 ? 0.50 : 0.28})`,
                    borderTop:'none',
                    backdropFilter:'blur(28px) saturate(180%)',
                  }}>
                    {/* dept color glow stripe at card bottom → appears at top of reflection near floor */}
                    <div style={{
                      position:'absolute', bottom:0, left:0, right:0, height:32,
                      background:`linear-gradient(to top, rgba(${dept.a},0.45) 0%, transparent 100%)`,
                    }}/>
                    {/* dept label — shown upside-down in reflection */}
                    {relIdx === 0 && (
                      <div style={{
                        position:'absolute', bottom:8, left:12,
                        fontFamily:"'Cinzel',serif", fontSize:'0.70rem', fontWeight:700,
                        letterSpacing:'0.06em', textTransform:'uppercase',
                        color:`rgba(255,255,255,0.55)`,
                        textShadow:`0 0 12px rgba(${dept.a},0.60)`,
                      }}>{dept.label}</div>
                    )}
                    {/* sweeping sheen on reflection */}
                    <div style={{
                      position:'absolute', top:0, width:'55%', height:'100%',
                      background:'linear-gradient(108deg,transparent 0%,rgba(255,255,255,0.06) 50%,transparent 100%)',
                      animation:'cardSweep 6s ease-in-out infinite',
                      animationDelay:`${-(idx*0.75).toFixed(2)}s`,
                    }}/>
                    {/* left edge highlight */}
                    <div style={{
                      position:'absolute', top:0, left:0, bottom:0, width:1.5,
                      background:`linear-gradient(to bottom,rgba(255,255,255,0.45),rgba(255,255,255,0.12),transparent)`,
                    }}/>
                    {/* right edge highlight */}
                    <div style={{
                      position:'absolute', top:0, right:0, bottom:0, width:1,
                      background:`linear-gradient(to bottom,rgba(255,255,255,0.22),transparent)`,
                    }}/>
                  </div>

                  {/* fade mask: fully visible at top (floor line), transparent at bottom */}
                  <div style={{
                    position:'absolute', inset:0,
                    background:'linear-gradient(to bottom, transparent 0%, rgba(1,1,6,0.55) 60%, rgba(1,1,6,1) 100%)',
                    pointerEvents:'none',
                  }}/>

                  {/* floor contact line */}
                  <div style={{
                    position:'absolute', top:0, left:'5%', right:'5%', height:1,
                    background:`linear-gradient(90deg, transparent, rgba(255,255,255,${relIdx===0?0.65:0.35}) 30%, rgba(255,255,255,${relIdx===0?0.65:0.35}) 70%, transparent)`,
                    boxShadow:`0 0 8px 1px rgba(${dept.a},0.35)`,
                  }}/>
                </div>
              );
            })}

            {/* ── floor depth fade ── */}
            <div style={{
              position:'absolute', bottom:0, left:0, right:0, height:220, zIndex:8,
              background:'linear-gradient(to bottom, transparent 0%, rgba(1,1,6,0.55) 70%, rgba(1,1,6,0.88) 100%)',
              pointerEvents:'none',
            }}/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          CODE ENTRY PHASE
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === 'code' && (
          <motion.div
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
            transition={{ duration:0.4 }}
            style={{
              position:'absolute', inset:0, zIndex:30,
              display:'flex', flexDirection:'column',
              justifyContent:'center', alignItems:'flex-start',
              padding:'0 10vw',
            }}
          >
            <button className="hs-back" onClick={() => { setPhase('select'); setCode(''); setErrMsg(''); setExpandedCard(null); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <h1 style={{
              fontFamily:'Cinzel,serif', fontSize:'clamp(1.8rem,3.2vw,3rem)', fontWeight:400,
              letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8,
              background:'linear-gradient(105deg,#00e5ff 0%,#4f46e5 22%,#7c3aed 38%,#a855f7 54%,#06b6d4 72%,#00e5ff 100%)',
              backgroundSize:'300% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundClip:'text', animation:'hs-aurora 5s ease infinite',
            }}>{selDept?.label}</h1>
            <p style={{fontSize:'0.78rem', letterSpacing:'0.18em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:28}}>
              {selDept?.hint}
            </p>
            <form
              className={`hs-cform${shake ? ' hs-shake' : ''}`}
              onSubmit={handleSubmit}
              style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}}
            >
              <div style={{position:'relative', display:'inline-flex', alignItems:'center'}}>
                <input
                  ref={inputRef}
                  className={`hs-cinput${errMsg ? ' hs-err' : ''}`}
                  type={showCode ? 'text' : 'password'}
                  value={code}
                  onChange={e => { setCode(e.target.value); setErrMsg(''); }}
                  placeholder="— — — —" maxLength={10} autoComplete="off" spellCheck={false}
                  style={{paddingRight:36}}
                />
                <button type="button" onClick={() => setShowCode(v => !v)}
                  style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',padding:4,color:showCode?'#cc0000':'#444',outline:'none'}}>
                  {showCode
                    ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  }
                </button>
              </div>
              <div className={`hs-errmsg${errMsg ? ' vis' : ''}`}>{errMsg || ' '}</div>
              <div className="hs-hint">Press Enter to confirm</div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
