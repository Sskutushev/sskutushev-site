# sskutushev-site

A production-shaped digital portfolio for a backend-oriented TypeScript Product Engineer. It is a real vertical slice, not a static mock: React/R3F reads portfolio content from a NestJS code-first GraphQL API backed by Prisma and CockroachDB. Redis provides cache resilience; S3-compatible storage is an explicit asset boundary.

## Reviewer in 10 minutes

1. Open the web UI and toggle **ENG** to inspect truthful runtime state.
2. Query `portfolioData(locale: RU)` at `/graphql` in development.
3. Read the [architecture overview](docs/architecture/overview.md) and the ADRs.
4. Inspect the ordered CI chain from dependency install through publishing.
5. Run the full local stack with `docker compose up --build`.

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

## Useful commands

```bash
pnpm verify
pnpm prisma:validate
docker compose up --build
```

No performance number is advertised until CI measures it. If the API is unavailable, the UI shows a clearly marked static fallback instead of presenting invented live data.

The fallback is an explicit checked-in portfolio snapshot for static GitHub Pages hosting. CockroachDB remains the source of truth whenever the API is connected; the UI marks fallback data as stale.

## Documentation

- [Architecture](docs/architecture/overview.md) — runtime boundaries and data flow
- [Architecture decisions](docs/adr/) — concise records of non-trivial choices
- [Testing strategy](docs/quality/testing.md) — risk-based verification layers
- [Performance contract](docs/quality/performance.md) — WebGL and web budgets
- [Security model](docs/operations/security.md) — trust boundaries and hardening status
- [AI usage](docs/operations/ai-usage.md) — transparent scope and rejected suggestions
