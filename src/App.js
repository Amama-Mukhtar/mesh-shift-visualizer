import { useState, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import MeshGrid from './components/MeshGrid';
import ComplexityPanel from './components/ComplexityPanel';
import { buildInitialNodes, applyRowShift, applyColShift, computeShift, isPerfectSquare } from './utils/shiftLogic';

export default function App() {
  const [p, setP] = useState(16);
  const [q, setQ] = useState(6);
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [nodes, setNodes] = useState(() => buildInitialNodes(16));
  const [before, setBefore] = useState(() => buildInitialNodes(16));
  const [after, setAfter] = useState(null);
  const { sqrtP, rowShift, colShift } = computeShift(p, q);

  const handleSetP = (val) => {
    if (!isPerfectSquare(val) || val < 4 || val > 64) { setP(val); return; }
    setP(val);
    const fresh = buildInitialNodes(val);
    setNodes(fresh); setBefore(fresh); setAfter(null); setStage(0);
    if (q >= val) setQ(1);
  };

  const handleReset = useCallback(() => {
    const fresh = buildInitialNodes(p);
    setNodes(fresh); setBefore(fresh); setAfter(null);
    setStage(0); setRunning(false); setAnimating(false);
  }, [p]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleRun = useCallback(async () => {
    if (running) return;
    const fresh = buildInitialNodes(p);
    setBefore(fresh); setNodes(fresh); setAfter(null);
    setStage(0); setRunning(true);
    await new Promise(r => setTimeout(r, 400));

    setStage(1); setAnimating(true);
    const afterRow = applyRowShift(fresh, p, rowShift);
    setNodes(afterRow);
    await new Promise(r => setTimeout(r, 1300));
    setAnimating(false);
    await new Promise(r => setTimeout(r, 300));

    setStage(2); setAnimating(true);
    const afterCol = applyColShift(afterRow, p, colShift);
    setNodes(afterCol);
    await new Promise(r => setTimeout(r, 1300));
    setAnimating(false);
    await new Promise(r => setTimeout(r, 200));

    setAfter(afterCol); setStage(3); setRunning(false);
  }, [p, rowShift, colShift, running]);

  const expCards = [
    { border: '#475569', icon: '📐', title: 'Ready to simulate', text: `Press ▶ Simulate. Each node i → (i + ${q}) mod ${p}.` },
    { border: '#f59e0b', icon: '→', title: 'Stage 1 — Row Shift', text: `Every node shifts ${rowShift} position(s) right. (${q} mod ${sqrtP} = ${rowShift})` },
    { border: '#06b6d4', icon: '↓', title: 'Stage 2 — Column Shift', text: `Every node shifts ${colShift} position(s) down. (⌊${q}/${sqrtP}⌋ = ${colShift})` },
    { border: '#22c55e', icon: '✓', title: 'Complete!', text: `Mesh used ${rowShift + colShift} steps vs Ring's ${Math.min(q, p - q)} steps.` },
  ];
  const exp = expCards[stage];

  return (
    <div style={{ background: '#0a0e1a', minHeight: '100vh', fontFamily: "'Syne', sans-serif", color: '#e2e8f0' }}>

      <header style={{ background: 'linear-gradient(135deg,#0d1b2e,#111827)', borderBottom: '1px solid #2a3f5f', padding: '0 2rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20, padding: '16px 0' }}>
          <div style={{ background: '#f59e0b', color: '#000', fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 11, padding: '6px 10px', borderRadius: 4, letterSpacing: 2 }}>PDC</div>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 22, letterSpacing: 4 }}>MESH CIRCULAR SHIFT VISUALIZER</h1>
            <p style={{ fontSize: 11, color: '#475569', letterSpacing: 1, marginTop: 2 }}>NUCES CFD — Parallel & Distributed Computing — Spring 2026</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 24, fontFamily: "'Space Mono',monospace", fontSize: 16, color: '#f59e0b' }}>
            <span>p = {p}</span><span>q = {q}</span><span style={{ color: '#475569' }}>√p = {sqrtP}</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: 20, padding: 24 }}>

        <ControlPanel p={p} q={q} setP={handleSetP} setQ={setQ} onRun={handleRun} onReset={handleReset} stage={stage} running={running} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 12, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 420, width: '100%' }}>
            {stage < 3 ? (
              <MeshGrid nodes={nodes} p={p} q={q} stage={stage} sqrtP={sqrtP} animating={animating} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                  { label: 'BEFORE', nodes: before, st: 0 },
                  { label: 'AFTER', nodes: after, st: 3 }
                ].map(({ label, nodes: n, st }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, background: '#0a0e1a', border: `1px solid ${label === 'AFTER' ? '#22c55e' : '#1e2d45'}`, borderRadius: 12, padding: 20 }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 3, color: '#475569' }}>{label}</div>
                    <MeshGrid nodes={n} p={p} q={q} stage={st} sqrtP={sqrtP} animating={false} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: '#111827', border: `1px solid #1e2d45`, borderLeft: `3px solid ${exp.border}`, borderRadius: 10, padding: '14px 18px', width: '100%' }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{exp.icon}</span>
            <div>
              <strong style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>{exp.title}</strong>
              <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{exp.text}</p>
            </div>
          </div>
        </div>

        <ComplexityPanel p={p} q={q} />
      </main>

      <footer style={{ textAlign: 'center', padding: 16, fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 2, color: '#475569', borderTop: '1px solid #1e2d45', marginTop: 20 }}>
        NUCES CFD — PDC Spring 2026 — Assignment 2, Q4
      </footer>
    </div>
  );
}