import { meshSteps, ringSteps, computeShift } from '../utils/shiftLogic';

export default function ComplexityPanel({ p, q }) {
  const { rowShift, colShift, sqrtP } = computeShift(p, q);
  const mesh = meshSteps(q, p);
  const ring = ringSteps(q, p);
  const saving = ring - mesh;
  const pct = ring > 0 ? Math.round((saving / ring) * 100) : 0;
  const maxBar = Math.max(mesh, ring, 1);

  return (
    <div style={s.panel}>
      <div style={s.header}>
        <span style={s.icon}>◈</span>
        <h2 style={s.title}>COMPLEXITY PANEL</h2>
      </div>

      <div style={s.stat}>
        <span style={s.statLabel}>Row Shift</span>
        <span style={{ ...s.statVal, color: '#f59e0b' }}>{rowShift}</span>
        <span style={s.statSub}>{q} mod {sqrtP}</span>
      </div>
      <div style={s.stat}>
        <span style={s.statLabel}>Col Shift</span>
        <span style={{ ...s.statVal, color: '#06b6d4' }}>{colShift}</span>
        <span style={s.statSub}>⌊{q}/{sqrtP}⌋</span>
      </div>
      <div style={s.stat}>
        <span style={s.statLabel}>Total Steps</span>
        <span style={{ ...s.statVal, color: '#22c55e' }}>{mesh}</span>
        <span style={s.statSub}>{rowShift} + {colShift}</span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
          <span>Mesh Steps</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#475569' }}>(q mod √p) + ⌊q/√p⌋</span>
        </div>
        <div style={{ background: '#1a2235', borderRadius: 4, height: 28, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ width: `${(mesh / maxBar) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#065f46,#22c55e)', display: 'flex', alignItems: 'center', padding: '0 8px', fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: '#fff', borderRadius: 4, minWidth: 30, transition: 'width 0.6s' }}>
            {mesh}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
          <span>Ring Steps</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#475569' }}>min(q, p−q)</span>
        </div>
        <div style={{ background: '#1a2235', borderRadius: 4, height: 28, overflow: 'hidden' }}>
          <div style={{ width: `${(ring / maxBar) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#7f1d1d,#ef4444)', display: 'flex', alignItems: 'center', padding: '0 8px', fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: '#fff', borderRadius: 4, minWidth: 30, transition: 'width 0.6s' }}>
            {ring}
          </div>
        </div>
      </div>

      <div style={s.savings}>
        <span style={{ fontSize: 20 }}>⚡</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#22c55e' }}>Mesh saves {saving} steps</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{pct}% fewer than Ring</div>
        </div>
      </div>

      <div style={s.table}>
        <div style={{ ...s.tableRow, background: '#1a2235' }}>
          <span style={{ color: '#475569', fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Metric</span>
          <span style={{ color: '#475569', fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Mesh</span>
          <span style={{ color: '#475569', fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Ring</span>
        </div>
        <div style={s.tableRow}>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Steps</span>
          <span style={{ color: '#22c55e', fontSize: 12 }}>{mesh}</span>
          <span style={{ color: '#ef4444', fontSize: 12 }}>{ring}</span>
        </div>
        <div style={s.tableRow}>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Complexity</span>
          <span style={{ color: '#22c55e', fontSize: 12 }}>O(√p)</span>
          <span style={{ color: '#ef4444', fontSize: 12 }}>O(p)</span>
        </div>
        <div style={s.tableRow}>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>For p={p}</span>
          <span style={{ color: '#22c55e', fontSize: 12 }}>{mesh} steps</span>
          <span style={{ color: '#ef4444', fontSize: 12 }}>{ring} steps</span>
        </div>
      </div>
    </div>
  );
}

const s = {
  panel: { background: '#111827', border: '1px solid #1e2d45', borderRadius: 12, padding: 20 },
  header: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #1e2d45' },
  icon: { fontSize: 18, color: '#f59e0b' },
  title: { fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 3, color: '#94a3b8' },
  stat: { background: '#1a2235', border: '1px solid #1e2d45', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  statLabel: { fontSize: 10, color: '#475569', fontFamily: "'Space Mono',monospace", letterSpacing: 1, width: 75, flexShrink: 0 },
  statVal: { fontFamily: "'Space Mono',monospace", fontSize: 22, fontWeight: 700, width: 36, textAlign: 'center' },
  statSub: { fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#475569' },
  savings: { display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 },
  table: { background: '#1a2235', border: '1px solid #1e2d45', borderRadius: 8, overflow: 'hidden' },
  tableRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '8px 12px', borderBottom: '1px solid #1e2d45', gap: 8 },
};