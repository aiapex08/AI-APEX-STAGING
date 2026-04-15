// NAFFCO — StatCard component (stub)
import React from 'react';
export default function StatCard({ label, value }) {
  return (
    <div style={{ background: 'var(--nf-surface)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius)', padding: '16px 20px' }}>
      <div style={{ fontSize: 12, color: 'var(--nf-text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--nf-text)', marginTop: 4 }}>{value}</div>
    </div>
  );
}
