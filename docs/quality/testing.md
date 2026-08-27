# Testing strategy

Verification is organized around risk rather than mirroring source files:

- domain invariants and state transitions;
- GraphQL schema and public error contracts;
- CockroachDB constraints, transactions and migrations;
- Redis cache miss, stale fallback and in-flight deduplication;
- GitHub response mapping, timeout/provider failure, stale state and snapshot persistence;
- S3 presigned upload and idempotent confirmation;
- accessible UI states and browser journeys;
- WebGL performance and reduced-motion behavior.

The sequential pipeline covers formatting, linting, strict type checking, unit/component tests,
migration validation, security auditing and production builds. Redis tests protect stale fallback
and in-flight deduplication. Component tests exercise the assistant's accessible form, verified
sources and suggestion flow. The build gate then boots compiled NestJS against real CockroachDB
and Redis containers and executes liveness plus GraphQL contract smoke requests.
