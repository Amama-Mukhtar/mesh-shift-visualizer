export function computeShift(p, q) {
  const sqrtP = Math.round(Math.sqrt(p));
  const rowShift = q % sqrtP;
  const colShift = Math.floor(q / sqrtP);
  return { rowShift, colShift, sqrtP };
}

export function buildInitialNodes(p) {
  const sqrtP = Math.round(Math.sqrt(p));
  return Array.from({ length: p }, (_, i) => ({
    id: i, data: i,
    row: Math.floor(i / sqrtP),
    col: i % sqrtP,
  }));
}

export function applyRowShift(nodes, p, rowShift) {
  const sqrtP = Math.round(Math.sqrt(p));
  return nodes.map(n => ({ ...n, col: (n.col + rowShift) % sqrtP }));
}

export function applyColShift(nodes, p, colShift) {
  const sqrtP = Math.round(Math.sqrt(p));
  return nodes.map(n => ({ ...n, row: (n.row + colShift) % sqrtP }));
}

export function meshSteps(q, p) {
  const sqrtP = Math.round(Math.sqrt(p));
  return (q % sqrtP) + Math.floor(q / sqrtP);
}

export function ringSteps(q, p) { return Math.min(q, p - q); }

export function isPerfectSquare(n) {
  const s = Math.round(Math.sqrt(n));
  return s * s === n;
}