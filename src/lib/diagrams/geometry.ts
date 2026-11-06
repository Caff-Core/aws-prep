import type { DiagramConnection, DiagramNode, DiagramSpec } from './types';

/** Half the icon size plus room for the arrowhead and node label. */
const ICON_CLEARANCE = 36;

export interface ConnectionLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  midX: number;
  midY: number;
}

/** Straight line between two nodes, trimmed so it stops short of each icon. */
export function connectionLine(from: DiagramNode, to: DiagramNode): ConnectionLine {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const offsetX = (dx / length) * ICON_CLEARANCE;
  const offsetY = (dy / length) * ICON_CLEARANCE;

  const line = {
    x1: from.x + offsetX,
    y1: from.y + offsetY,
    x2: to.x - offsetX,
    y2: to.y - offsetY,
  };
  return { ...line, midX: (line.x1 + line.x2) / 2, midY: (line.y1 + line.y2) / 2 };
}

export function resolveConnection(spec: DiagramSpec, connection: DiagramConnection) {
  const from = spec.nodes.find((node) => node.id === connection.from);
  const to = spec.nodes.find((node) => node.id === connection.to);
  if (!from || !to) {
    throw new Error(`${spec.id}: connection ${connection.from} -> ${connection.to} has no node`);
  }
  return { ...connection, line: connectionLine(from, to) };
}
