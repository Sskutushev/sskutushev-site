# Deployment

The site is published to GitHub Pages, which serves files and nothing else. The
GraphQL surface, the realtime feed and the assistant need a process, so the API
runs on a container host and the browser calls it across origins.

Everything here fits inside free tiers. Where a free tier imposes a cost that is
not money — a sleeping instance, a database that expires — it is named rather
than glossed over.

## What runs where

| Piece           | Where                           | Why there                                                    |
| --------------- | ------------------------------- | ------------------------------------------------------------ |
| Web             | GitHub Pages                    | Static, already published by `ci.yml`                        |
| API             | Render web service, free plan   | Docker runtime, and `render.yaml` describes it in this repo  |
| Cache and queue | Render Key Value, free plan     | Same account, same region, no second signup                  |
| Source of truth | CockroachDB Cloud, free cluster | The Prisma provider is `cockroachdb`, and it does not expire |
| Object storage  | not deployed                    | Nothing writes to it with mutations off                      |

The résumé used to come from object storage. It ships with the web build now,
so a static host serves it without an API — see `apps/web/scripts/copy-resume.mjs`.

## What only a person can do

Two accounts. Neither can be created on someone's behalf.

1. **CockroachDB Cloud** — create a free serverless cluster and copy its
   connection string. The free cluster does not expire; a hosted Postgres that
   is deleted after thirty days would turn a CV link into a dead one.
2. **Render** — create an account, then **New → Blueprint** and point it at this
   repository. `render.yaml` describes the web service and the Key Value
   instance, so there is nothing to configure by hand except the values marked
   `sync: false`, which Render will prompt for:
   - `DATABASE_URL` — the CockroachDB connection string
   - `GEMINI_API_KEY` — a key from Google AI Studio
   - `GEMINI_PROJECT_ID` — the project the key belongs to

`REDIS_URL` is wired to the Key Value instance by the blueprint. `WEB_ORIGIN` is
already `https://sskutushev.github.io` — the exact origin the browser sends, with
no path, because CORS compares the whole string.

## Then, once

The database starts empty. Migrations and the seed run from a machine that has
the repository, against the cloud cluster:

```sh
DATABASE_URL='<cockroach connection string>' pnpm prisma migrate deploy
DATABASE_URL='<cockroach connection string>' pnpm prisma:seed
```

This is deliberately not a container start-up step. A migration that runs on
every boot runs during a rollout, which is the failure the `production-migration`
case study is about.

## Then, in this repository

Settings → Secrets and variables → Actions → **Variables** (not Secrets):

```
PUBLIC_GRAPHQL_URL = https://<service>.onrender.com/graphql
```

It is a variable because `ci.yml` reads `vars.PUBLIC_GRAPHQL_URL`, and because a
URL a browser is about to request is not a secret. The next build bakes it into
the bundle as `VITE_GRAPHQL_URL`; without it the bundle falls back to `/graphql`
on its own origin, which on Pages is nothing, and the site shows the static slice
and says so.

That variable also switches on `.github/workflows/keep-api-warm.yml`, which pings
`/health/live` every ten minutes. A free instance sleeps after a quiet period and
takes most of a minute to wake, and a reviewer reads that as a broken site. The
ping is a workaround, not architecture; the real fix is an instance that does not
sleep.

## Verifying

```sh
curl -s -o /dev/null -w '%{http_code}\n' https://<service>.onrender.com/health/live
curl -s -X POST https://<service>.onrender.com/graphql \
  -H 'content-type: application/json' \
  -d '{"query":"{ portfolioData(locale: RU) { profile { fullName } } }"}'
```

The image was verified this way before any of it was deployed: built from
`infrastructure/docker/api.Dockerfile`, started with no S3 credentials at all,
`/health/live` and `/health/ready` both 200, and `portfolioData` returning rows
from CockroachDB.

## A note on the blueprint

`type: keyvalue` is Render's current name for what it used to call `redis`. If
the blueprint is rejected on that field, the older name is the fix — the rest of
the file is unaffected.
