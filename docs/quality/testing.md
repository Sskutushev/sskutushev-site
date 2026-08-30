# Testing strategy

## GraphQL contract drift

`pnpm graphql:check` builds the NestJS resolver metadata into the committed `schema.graphql`,
regenerates typed web operations, and fails when either output differs from Git. The generator uses
Nest's schema factory without booting the API or connecting to infrastructure, so the contract gate
is deterministic in the fast CI stage. Frontend request and response types come from these generated
operations rather than manually duplicated DTOs.

Verification is organized around risk rather than mirroring source files:

- domain invariants and state transitions;
- GraphQL schema and public error contracts;
- CockroachDB constraints, transactions and migrations;
- mutation fail-closed behavior, optimistic concurrency and post-commit cache invalidation;
- Redis cache miss, stale fallback and in-flight deduplication;
- GitHub response mapping, timeout/provider failure, stale state and snapshot persistence;
- S3 checksum-bound presigned upload, size/type rejection and idempotent confirmation;
- accessible UI states and browser journeys;
- WebGL performance and reduced-motion behavior.

The sequential pipeline covers formatting, linting, strict type checking, unit/component tests,
migration validation, security auditing and production builds. Redis tests protect stale fallback
and in-flight deduplication. Component tests exercise the assistant's accessible form, verified
sources and suggestion flow. The build gate then boots compiled NestJS against real CockroachDB
and Redis containers and executes liveness plus GraphQL contract smoke requests.

The main-branch quality workflow produces JSON test and coverage reports, Playwright results,
Lighthouse runs, dependency-audit counts and measured gzip bundle sizes. A fail-fast generator
combines those evidence files into `quality-report.json`; the report is retained as a CI artifact,
optionally copied to S3 and imported through the authenticated management mutation.
