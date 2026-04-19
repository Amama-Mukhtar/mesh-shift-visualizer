export default function MeshGrid({ nodes, p, q, stage, sqrtP, animating }) {
  const cellSize = Math.min(75, Math.floor(460 / sqrtP));
  const gap = Math.max(6, Math.floor(cellSize * 0.12));
  const gridPx = sqrtP * cellSize + (sqrtP - 1) * gap;
  const stageColors = ['#64748b', '#f59e0b', '#06b6d4', '#22c55e'];
  const stageLabels = ['Initial State', 'Stage 1: Row Shift →', 'Stage 2: Column Shift ↓', 'Final State'];

  if (!nodes || nodes.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Space Mono', monospace", fontSize: 12, color: stageColors[stage] }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: stageColors[stage], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#000' }}>
          {['0','1','2','✓'][stage]}
        </div>
        {stageLabels[stage]}
      </div>

      <div style={{ position: 'relative', width: gridPx, height: gridPx }}>
        {Array.from({ length: sqrtP - 1 }, (_, i) => (
          <div key={`h${i}`} style={{ position: 'absolute', top: (i+1)*(cellSize+gap)-gap/2, left: 0, width: gridPx, height: 1, background: '#1e2d45', zIndex: 0 }} />
        ))}
        {Array.from({ length: sqrtP - 1 }, (_, i) => (
          <div key={`v${i}`} style={{ position: 'absolute', left: (i+1)*(cellSize+gap)-gap/2, top: 0, height: gridPx, width: 1, background: '#1e2d45', zIndex: 0 }} />
        ))}
        {nodes.map(node => {
          const displayRow = sqrtP - 1 - node.row;
          const x = node.col * (cellSize + gap);
          const y = displayRow * (cellSize + gap);
          const dest = (node.id + q) % p;
          const isDone = stage === 3;
          return (
            <div key={node.id}
              title={`Node ${node.id} → Node ${dest}`}
              style={{
                position: 'absolute',
                width: cellSize, height: cellSize,
                transform: `translate(${x}px, ${y}px)`,
                background: isDone ? '#14532d' : animating ? 'rgba(245,158,11,0.1)' : '#1a2235',
                border: `1.5px solid ${isDone ? '#22c55e' : animating ? '#f59e0b' : '#2a3f5f'}`,
                borderRadius: 8,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), background 0.4s, border-color 0.4s',
                boxShadow: animating ? '0 0 14px rgba(245,158,11,0.3)' : 'none',
                zIndex: 1, cursor: 'default',
              }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: Math.max(8, cellSize*0.15), color: '#475569', lineHeight: 1 }}>N{node.id}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: Math.max(12, cellSize*0.28), color: '#e2e8f0', lineHeight: 1.1 }}>{node.data}</div>
              {stage === 0 && <div style={{ fontFamily: "'Space Mono',monospace", fontSize: Math.max(7, cellSize*0.13), color: '#06b6d4', lineHeight: 1 }}>→{dest}</div>}
            </div>
          );
        })}
      </div>

      {stage === 1 && (
        <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid #f59e0b', borderRadius: 20, padding: '4px 14px', fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#f59e0b' }}>
          → Row shift: {q % sqrtP} right
        </div>
      )}
      {stage === 2 && (
        <div style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid #06b6d4', borderRadius: 20, padding: '4px 14px', fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#06b6d4' }}>
          ↓ Col shift: {Math.floor(q/sqrtP)} down
        </div>
      )}
    </div>
  );
}