# Testing strategy

Verification is organized around risk rather than mirroring source files:

- domain invariants and state transitions;
- GraphQL schema and public error contracts;
- CockroachDB constraints, transactions and migrations;
- Redis cache miss, stale fallback and in-flight deduplication;
- S3 presigned upload and idempotent confirmation;
- accessible UI states and browser journeys;
- WebGL performance and reduced-motion behavior.

The first gate covers formatting, linting, strict type checking, unit tests and production builds. Container-backed suites gate infrastructure behavior before deployment.
