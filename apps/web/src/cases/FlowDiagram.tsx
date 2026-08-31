import { useId, useState } from 'react';
import type { Locale } from '../lib/portfolio';
import { StatusDot } from '../ui/StatusDot';
import type { DataState } from '../ui/StatusDot';
import {
  edgePath,
  edgeState,
  nodeState,
  type FlowCase,
  type FlowNode,
  type FlowState,
} from './flow-diagram';

const NODE_H = 9;
/** Diagram units per character at the label's font size, plus padding. */
const NODE_CH = 1.55;
const NODE_PAD = 5;

function nodeWidth(label: string): number {
  return Math.max(18, label.length * NODE_CH + NODE_PAD);
}

/**
 * Named paths through a system, not live traffic. Saying so is not a caveat:
 * an unlabelled simulation next to real telemetry is exactly the invented
 * metric this site argues against.
 */
const SIMULATED: Record<Locale, string> = {
  RU: 'Симуляция · не боевой трафик',
  EN: 'Simulation · not live traffic',
};

const OUTCOME_STATE: Record<FlowState, DataState> = {
  idle: 'simulated',
  active: 'ok',
  degraded: 'degraded',
  failed: 'failed',
  skipped: 'simulated',
};

function find(nodes: FlowNode[], id: string): FlowNode {
  const node = nodes.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`flow diagram references an unknown node: ${id}`);
  return node;
}

/**
 * A request travelling through a named topology.
 *
 * Both the route and its outcome are stated in text beside the drawing: the
 * diagram explains the shape of the system, never the result on its own, so
 * nothing here is reachable only by looking at colour or motion.
 */
export function FlowDiagram({
  flow,
  locale,
  label,
}: {
  flow: FlowCase;
  locale: Locale;
  label: string;
}): React.JSX.Element {
  const [activeId, setActiveId] = useState(flow.scenarios[0]!.id);
  const scenario = flow.scenarios.find((item) => item.id === activeId) ?? flow.scenarios[0]!;
  const groupId = useId();

  return (
    <figure className="flow">
      <p className="flow__label t-meta-sm text-tertiary">
        <StatusDot state="simulated" />
        {SIMULATED[locale]}
      </p>
      <div aria-label={label} className="flow__controls" role="group">
        {flow.scenarios.map((item) => (
          <button
            aria-pressed={item.id === activeId}
            key={item.id}
            onClick={() => setActiveId(item.id)}
            type="button"
          >
            {item.label[locale]}
          </button>
        ))}
      </div>

      <svg aria-describedby={groupId} className="flow__canvas" viewBox="0 0 100 60">
        <g>
          {flow.edges.map((edge) => (
            <path
              className={`flow__edge is-${edgeState(scenario, edge)}`}
              d={edgePath(find(flow.nodes, edge.from), find(flow.nodes, edge.to), edge.bow)}
              key={`${edge.from}-${edge.to}`}
            />
          ))}
        </g>
        {/* One packet per live segment, staggered by its position on the route,
            so the request is seen travelling rather than the path being seen
            already coloured. Hidden under reduced motion: the route and its
            outcome are both stated in text. */}
        <g>
          {flow.edges.map((edge) => {
            const state = edgeState(scenario, edge);
            if (state !== 'active' && state !== 'degraded') return null;
            const from = find(flow.nodes, edge.from);
            const to = find(flow.nodes, edge.to);
            return (
              <circle
                className={`flow__packet is-${state}`}
                key={`packet-${edge.from}-${edge.to}`}
                r="0.9"
                style={{
                  offsetPath: `path("${edgePath(from, to, edge.bow)}")`,
                  animationDelay: `${scenario.route.indexOf(edge.from) * 0.42}s`,
                }}
              />
            );
          })}
        </g>
        <g>
          {flow.nodes.map((node) => (
            <g className={`flow__node is-${nodeState(scenario, node.id)}`} key={node.id}>
              <rect
                height={NODE_H}
                rx="2"
                width={nodeWidth(node.label)}
                x={node.x - nodeWidth(node.label) / 2}
                y={node.y - NODE_H / 2}
              />
              <text dominantBaseline="middle" textAnchor="middle" x={node.x} y={node.y}>
                {node.label}
              </text>
            </g>
          ))}
        </g>
      </svg>

      <figcaption className="flow__outcome" id={groupId}>
        <strong className={`t-meta flow__status is-${scenario.outcome.state}`}>
          <StatusDot state={OUTCOME_STATE[scenario.outcome.state]} />
          {scenario.outcome.status}
        </strong>
        <span className="t-small text-secondary">{scenario.outcome.detail[locale]}</span>
      </figcaption>
    </figure>
  );
}
