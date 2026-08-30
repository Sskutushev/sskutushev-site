# ADR-011: GraphQL as the typed portfolio contract

Status: accepted

GraphQL owns portfolio reads, management mutations, quality data, activity, semantic answers, and
realtime subscriptions. NestJS generates the committed schema from resolver metadata; GraphQL Code
Generator derives frontend operation types from that schema. CI regenerates both sides and rejects
drift.

Production disables introspection and portfolio mutations by default. Depth, complexity, body-size,
rate-limit, and sanitized error boundaries are enforced before internal failures reach clients.
