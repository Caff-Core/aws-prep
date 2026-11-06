export type BoundaryKind =
  'cloud' | 'region' | 'availability-zone' | 'vpc' | 'subnet' | 'scaling-group' | 'external';

export interface DiagramBoundary {
  kind: BoundaryKind;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Official group icon shown beside the label. */
  icon?: string;
}

export interface DiagramNode {
  id: string;
  /** Key in src/data/aws-icons.json. */
  icon: string;
  label: string;
  /** Icon centre. */
  x: number;
  y: number;
}

export interface DiagramConnection {
  from: string;
  to: string;
  /** Number of the explanation step this arrow illustrates. */
  step?: number;
  label?: string;
  /** Dashed lines show an alternative or standby path. */
  dashed?: boolean;
  bidirectional?: boolean;
}

export interface DiagramSpec {
  id: string;
  title: string;
  /** Plain-language description for people who cannot see the diagram. */
  description: string;
  width: number;
  height: number;
  boundaries: DiagramBoundary[];
  nodes: DiagramNode[];
  connections: DiagramConnection[];
  steps: string[];
}
