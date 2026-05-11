import React, { useState } from 'react';

// Sample data for the status dashboard - in production, this comes from your DB
const INITIAL_REQUESTS = [
  { id: 'QT-701', project: 'Burj View Tower', status: 'PENDING_ARTIST', estimator: 'John Doe', date: '2026-04-28' },
  { id: 'QT-698', project: 'Dubai Mall Ext', status: 'FINALIZED', estimator: 'Jane Smith', date: '2026-04-25' },
];

export default function SalesForm() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [formData, setFormData] = useState({ projectName: '', clientName: '', doorCount: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: `QT-${Math.floor(Math.random() * 1000)}`,
      project: formData.projectName,
      status: 'SUBMITTED',
      estimator: 'Waiting for Assignment...',
      date: new Date().toISOString().split('T')[0]
    };
    setRequests([newRequest, ...requests]);
    setFormData({ projectName: '', clientName: '', doorCount: '' });
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'FINALIZED': return { color: '#00ff88', background: 'rgba(0, 255, 136, 0.1)' };
      case 'REVISE': return { color: '#ffcc00', background: 'rgba(255, 204, 0, 0.1)' };
      default: return { color: '#e8304a', background: 'rgba(232, 48, 74, 0.1)' };
    }
  };

  return (
    <div style={{ padding: '40px', background: '#0c0c0c', minHeight: '100vh', color: '#e8e6e3', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#e8304a', margin: 0, fontSize: '2rem' }}>NAFFCO Sales Portal</h1>
        <p style={{ color: '#b0ada8' }}>Fire Door Quotation Request System</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* NEW REQUEST FORM */}
        <section style={glassStyle}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>New Quotation Request</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={inputGroup}>
              <label style={labelStyle}>Project Name</label>
              <input 
                style={inputStyle} 
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                placeholder="e.g. Skyline Residency" 
              />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Client Name</label>
              <input 
                style={inputStyle} 
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                placeholder="Contractor/Consultant" 
              />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Approx. Door Qty</label>
              <input 
                type="number" 
                style={inputStyle} 
                value={formData.doorCount}
                onChange={(e) => setFormData({...formData, doorCount: e.target.value})}
              />
            </div>
            <button type="submit" style={buttonStyle}>Submit to Estimator</button>
          </form>
        </section>

        {/* STATUS DASHBOARD */}
        <section style={glassStyle}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Active Quotations</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                <th style={tableHead}>ID</th>
                <th style={tableHead}>Project</th>
                <th style={tableHead}>Estimator</th>
                <th style={tableHead}>Status</th>
                <th style={tableHead}>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={tableCell}>{req.id}</td>
                  <td style={tableCell}>{req.project}</td>
                  <td style={tableCell}>{req.estimator}</td>
                  <td style={tableCell}>
                    <span style={{ ...statusBadge, ...getStatusStyle(req.status) }}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={tableCell}>
                    <button style={actionBtn}>View Thread</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

// --- STYLING OBJECTS ---
const glassStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(10px)',
  padding: '25px',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.08)'
};

const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px' };
const labelStyle = { fontSize: '0.85rem', color: '#888' };
const inputStyle = {
  background: '#1a1a1a',
  border: '1px solid #333',
  padding: '12px',
  color: '#fff',
  borderRadius: '8px',
  outline: 'none'
};

const buttonStyle = {
  marginTop: '10px',
  padding: '12px',
  background: '#e8304a',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const tableHead = { padding: '15px 10px', color: '#888', fontWeight: 'normal', fontSize: '0.9rem' };
const tableCell = { padding: '15px 10px', fontSize: '0.9rem' };
const statusBadge = { padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' };
const actionBtn = { background: 'transparent', border: '1px solid #444', color: '#aaa', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };