# sskutushev-site

A production-shaped digital portfolio for a Senior+ Fullstack / Product Engineer with 60% backend and 40% frontend focus, plus strong data, DevOps, security and production ownership. It is a real vertical slice, not a static mock: React/R3F reads portfolio content from a NestJS code-first GraphQL API backed by Prisma and CockroachDB. Redis provides cache resilience; S3-compatible storage is an explicit asset boundary.

## Reviewer in 10 minutes

1. Open the web UI and toggle **ENG** to inspect truthful runtime state.
2. Query `portfolioData(locale: RU)` at `/graphql` in development.
3. Open **Engineering Mode** and ask the grounded Gemini assistant about verified experience.
4. Inspect the live GitHub activity snapshot and its explicit stale/offline states.
5. Read the [architecture overview](docs/architecture/overview.md) and the ADRs.
6. Inspect the ordered CI chain from dependency install through publishing.
7. Run the full local stack with `docker compose up --build`.

## Local setup

```bash
cp .env.example .env
pnpm install
pnpm prisma:generate
docker compose up -d cockroach redis minio
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Web: `http://localhost:3000`; GraphQL: `http://localhost:4000/graphql`.

Set `GEMINI_API_KEY` server-side to enable generated answers. Without it, `askProfile` remains available as a cited extractive fallback; the key is never included in the web bundle.

Set the optional server-side `GITHUB_TOKEN` to increase GitHub API limits. `ENABLE_WORKERS=false`
keeps background refresh disabled by default; public reads still refresh through the Redis-backed
stale-while-revalidate path.

Portfolio and asset mutations are fail-closed by default. Set `ENABLE_MUTATIONS=true` only in a
trusted management environment; profile writes require an `expectedVersion`, update related social
links in one transaction and return a named conflict for stale writers.

`docker compose up --build` waits for CockroachDB and applies migrations before starting the API,
semantic ranker, frontend, and synthetic probe. Seed a fresh database with
`docker compose run --rm api pnpm db:seed`.

## Useful commands

```bash
pnpm verify
pnpm verify:full
pnpm graphql:check
pnpm migrations:check
pnpm prisma:validate
docker compose up --build
```

No performance number is advertised until CI measures it. If the API is unavailable, the UI shows a clearly marked static fallback instead of presenting invented live data.

The fallback is an explicit checked-in portfolio snapshot for static GitHub Pages hosting. CockroachDB remains the source of truth whenever the API is connected; the UI marks fallback data as stale.

## Documentation

- [Architecture](docs/architecture/overview.md) — runtime boundaries and data flow
- [Architecture decisions](docs/adr/) — explicit records for data, cache, storage, contracts,
  bounded services, telemetry, and frontend rendering
- [Design system](docs/design/) — art direction, colour, typography, motion, and the 3D concept,
  versioned alongside the code they govern
- [Testing strategy](docs/quality/testing.md) — risk-based verification layers
- [Performance contract](docs/quality/performance.md) — WebGL and web budgets
- [Security model](docs/operations/security.md) — trust boundaries and hardening status
- [AI usage](docs/operations/ai-usage.md) — transparent scope and rejected suggestions

The committed GraphQL schema and generated web operation types are checked for drift by
`pnpm graphql:check`; API resolver changes cannot silently leave the frontend contract stale.
