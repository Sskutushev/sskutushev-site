import { buildSchema, parse, validate } from 'graphql';
import { describe, expect, it } from 'vitest';
import { operationLimitsRule } from './operation-limits.rule';

const schema = buildSchema(`
  type Query { portfolio: Portfolio! }
  type Portfolio { profile: Profile!, skills: [Skill!]! }
  type Profile { name: String! }
  type Skill { name: String! }
`);
const rule = operationLimitsRule({ maxDepth: 3, maxFields: 5 });

describe('operationLimitsRule', () => {
  it('accepts a bounded operation', () => {
    const errors = validate(schema, parse('{ portfolio { profile { name } } }'), [rule]);
    expect(errors).toEqual([]);
  });

  it('rejects excessive depth through named fragments', () => {
    const document = parse(`
      query { portfolio { ...PortfolioFields } }
      fragment PortfolioFields on Portfolio { profile { name } }
    `);
    const errors = validate(schema, document, [
      operationLimitsRule({ maxDepth: 2, maxFields: 20 }),
    ]);
    expect(errors[0]?.message).toContain('depth 3 exceeds limit 2');
  });

  it('rejects excessive field fanout', () => {
    const document = parse('{ portfolio { profile { name } skills { name } } }');
    const errors = validate(schema, document, [operationLimitsRule({ maxDepth: 5, maxFields: 4 })]);
    expect(errors[0]?.message).toContain('field count 5 exceeds limit 4');
  });
});
