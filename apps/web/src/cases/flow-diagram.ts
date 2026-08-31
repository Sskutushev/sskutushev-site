import type { Locale } from '../lib/portfolio';

/** Every node and edge resolves to one of these. Nothing renders without one. */
export type FlowState = 'idle' | 'active' | 'degraded' | 'failed' | 'skipped';

export interface FlowNode {
  id: string;
  label: string;
  /** Normalised position in the 0-100 × 0-60 diagram space. */
  x: number;
  y: number;
}

export interface FlowEdge {
  from: string;
  to: string;
  /** Vertical offset of the control point; 0 draws a straight line. */
  bow?: number;
}

export interface FlowScenario {
  id: string;
  label: Record<Locale, string>;
  /** The path the request actually takes, as node ids in order. */
  route: string[];
  /** Nodes the request deliberately does not reach, and why. */
  skipped?: string[];
  states?: Record<string, FlowState>;
  outcome: {
    status: string;
    state: FlowState;
    /** Stated in words as well as drawn: the diagram is never the only source. */
    detail: Record<Locale, string>;
  };
}

export interface FlowCase {
  nodes: FlowNode[];
  edges: FlowEdge[];
  scenarios: FlowScenario[];
}

/** Resolved state of one node under one scenario. */
export function nodeState(scenario: FlowScenario, id: string): FlowState {
  const explicit = scenario.states?.[id];
  if (explicit) return explicit;
  if (scenario.skipped?.includes(id)) return 'skipped';
  return scenario.route.includes(id) ? 'active' : 'idle';
}

/**
 * An edge is only live when both of its ends are consecutive stops on the
 * route. Colouring an edge because both ends happen to be active would draw
 * paths the request never took.
 */
export function edgeState(scenario: FlowScenario, edge: FlowEdge): FlowState {
  const from = scenario.route.indexOf(edge.from);
  if (from === -1 || scenario.route[from + 1] !== edge.to) {
    return scenario.skipped?.includes(edge.to) ? 'skipped' : 'idle';
  }
  const target = nodeState(scenario, edge.to);
  return target === 'idle' ? 'active' : target;
}

/** Quadratic path between two nodes in diagram space. */
export function edgePath(from: FlowNode, to: FlowNode, bow = 0): string {
  if (!bow) return `M${from.x} ${from.y} L${to.x} ${to.y}`;
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 + bow;
  return `M${from.x} ${from.y} Q${midX} ${midY} ${to.x} ${to.y}`;
}
