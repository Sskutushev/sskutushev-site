import { describe, expect, it } from 'vitest';
import { edgeState, nodeState } from './flow-diagram';
import { cacheFlow, moneyFlow } from './flows';

const timeout = cacheFlow.scenarios.find((scenario) => scenario.id === 'timeout')!;
const replay = moneyFlow.scenarios.find((scenario) => scenario.id === 'replay')!;

describe('node state', () => {
  it('marks the stops on the route active', () => {
    expect(nodeState(timeout, 'search')).toBe('active');
  });

  it('lets a scenario override a node it also routes through', () => {
    // The cache is on the route and degraded at the same time: it answers, and
    // what it answers with is stale.
    expect(nodeState(timeout, 'cache')).toBe('degraded');
    expect(nodeState(timeout, 'provider')).toBe('failed');
  });

  it('distinguishes a node that was not reached from one deliberately not used', () => {
    expect(nodeState(replay, 'ledger')).toBe('skipped');
    const hit = cacheFlow.scenarios[0]!;
    expect(nodeState(hit, 'provider')).toBe('skipped');
  });
});

describe('edge state', () => {
  it('is live only between consecutive stops', () => {
    expect(edgeState(timeout, { from: 'client', to: 'search' })).toBe('active');
    // Both ends are on the route, but the request never travels this way.
    expect(edgeState(timeout, { from: 'search', to: 'provider' })).toBe('idle');
  });

  it('carries the state of the node it arrives at', () => {
    expect(edgeState(timeout, { from: 'search', to: 'cache' })).toBe('degraded');
  });

  it('never colours an edge into a node the scenario skipped', () => {
    expect(edgeState(replay, { from: 'key', to: 'ledger' })).toBe('skipped');
  });
});

describe('every scenario', () => {
  it('routes only through nodes the topology declares', () => {
    for (const flow of [moneyFlow, cacheFlow]) {
      const ids = new Set(flow.nodes.map((node) => node.id));
      for (const scenario of flow.scenarios) {
        for (const id of [...scenario.route, ...(scenario.skipped ?? [])]) {
          expect(ids, `${scenario.id} → ${id}`).toContain(id);
        }
      }
    }
  });
});
