import React from 'react';
import { isPerfectSquare } from '../utils/shiftLogic';
export default function ControlPanel({ p, q, setP, setQ, onRun, onReset, stage, running }) {
  const sqrtP = Math.round(Math.sqrt(p));
  const pError = !isPerfectSquare(p) ? 'Perfect square hona chahiye (4,9,16,25,36,64)' : p < 4 || p > 64 ? '4 se 64 ke beech hona chahiye' : '';
  const qError = q < 1 || q >= p ? `1 se ${p - 1} ke beech hona chahiye` : '';
  const valid = !pError && !qError;
  const presets = [4, 9, 16, 25, 36, 64];

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <span style={styles.icon}>⬡</span>
        <h2 style={styles.title}>PARAMETERS</h2>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Node Count p <span style={styles.hint}>(perfect square)</span></label>
        <input type="number" value={p} min={4} max={64} disabled={running}
          onChange={e => setP(Number(e.target.value))}
          style={{ ...styles.input, ...(pError ? styles.inputErr : {}) }} />
        {pError && <span style={styles.errMsg}>{pError}</span>}
        <div style={styles.presets}>
          {presets.map(v => (
            <button key={v} onClick={() => setP(v)} disabled={running}
              style={{ ...styles.presetBtn, ...(p === v ? styles.presetActive : {}) }}>{v}</button>
          ))}
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Shift Value q <span style={styles.hint}>(1 to p−1)</span></label>
        <input type="number" value={q} min={1} max={p - 1} disabled={running}
          onChange={e => setQ(Number(e.target.value))}
          style={{ ...styles.input, ...(qError ? styles.inputErr : {}) }} />
        {qError && <span style={styles.errMsg}>{qError}</span>}
        <input type="range" min={1} max={p - 1} value={q} disabled={running}
          onChange={e => setQ(Number(e.target.value))}
          style={{ width: '100%', marginTop: 8, accentColor: '#f59e0b' }} />
      </div>

      <div style={styles.stageRow}>
        {['INIT','ROW','COL','DONE'].map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ ...styles.stageDot, ...(i < stage ? styles.stageDone : i === stage ? styles.stageActive : {}) }}>{s}</div>
            {i < 3 && <div style={styles.stageLine} />}
          </React.Fragment>
        ))}
      </div>

      <div style={styles.btnRow}>
        <button onClick={onRun} disabled={!valid || running} style={styles.btnRun}>
          {running ? '⏳ Running…' : '▶ Simulate'}
        </button>
        <button onClick={onReset} disabled={running} style={styles.btnReset}>↺ Reset</button>
      </div>

      <div style={styles.formulaBox}>
        <div style={styles.formulaTitle}>FORMULA</div>
        <div style={styles.formulaLine}>Row shift = q mod √p = {q} mod {sqrtP} = <b style={{color:'#f59e0b'}}>{q % sqrtP}</b></div>
        <div style={styles.formulaLine}>Col shift = ⌊q/√p⌋ = ⌊{q}/{sqrtP}⌋ = <b style={{color:'#06b6d4'}}>{Math.floor(q/sqrtP)}</b></div>
        <div style={{ ...styles.formulaLine, color: '#22c55e', marginTop: 8, borderTop: '1px solid #1e2d45', paddingTop: 8 }}>
          Node i → (i + {q}) mod {p}
        </div>
      </div>
    </div>
  );
}

const styles = {
  panel: { background: '#111827', border: '1px solid #1e2d45', borderRadius: 12, padding: 20 },
  header: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #1e2d45' },
  icon: { fontSize: 20, color: '#f59e0b' },
  title: { fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, color: '#94a3b8' },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase' },
  hint: { fontSize: 10, color: '#475569', fontWeight: 400, textTransform: 'none', letterSpacing: 0 },
  input: { width: '100%', background: '#1a2235', border: '1px solid #2a3f5f', borderRadius: 6, padding: '8px 12px', color: '#e2e8f0', fontFamily: "'Space Mono', monospace", fontSize: 16, outline: 'none' },
  inputErr: { borderColor: '#ef4444' },
  errMsg: { display: 'block', fontSize: 10, color: '#ef4444', marginTop: 4 },
  presets: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 },
  presetBtn: { background: '#1a2235', border: '1px solid #2a3f5f', borderRadius: 4, color: '#94a3b8', fontFamily: "'Space Mono', monospace", fontSize: 11, padding: '3px 8px', cursor: 'pointer' },
  presetActive: { background: '#f59e0b', color: '#000', borderColor: '#f59e0b' },
  stageRow: { display: 'flex', alignItems: 'center', margin: '18px 0 14px' },
  stageDot: { fontSize: 9, fontFamily: "'Space Mono', monospace", letterSpacing: 1, color: '#475569', background: '#1a2235', border: '1px solid #1e2d45', borderRadius: 4, padding: '3px 5px', whiteSpace: 'nowrap' },
  stageActive: { color: '#f59e0b', borderColor: '#f59e0b', background: 'rgba(245,158,11,0.1)' },
  stageDone: { color: '#22c55e', borderColor: '#22c55e', background: 'rgba(34,197,94,0.1)' },
  stageLine: { flex: 1, height: 1, background: '#1e2d45', margin: '0 3px' },
  btnRow: { display: 'flex', gap: 10 },
  btnRun: { flex: 1, background: '#f59e0b', color: '#000', border: 'none', borderRadius: 6, padding: '10px', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer', letterSpacing: 1 },
  btnReset: { background: '#1a2235', color: '#94a3b8', border: '1px solid #2a3f5f', borderRadius: 6, padding: '10px 14px', fontFamily: "'Syne', sans-serif", fontSize: 13, cursor: 'pointer' },
  formulaBox: { marginTop: 18, background: '#1a2235', border: '1px solid #1e2d45', borderLeft: '3px solid #f59e0b', borderRadius: 6, padding: 14 },
  formulaTitle: { fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: '#f59e0b', marginBottom: 8 },
  formulaLine: { fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#94a3b8', marginBottom: 4 },
};