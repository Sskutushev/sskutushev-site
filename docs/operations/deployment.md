# Production deployment and rollback

Production uses immutable GHCR image tags equal to the verified commit SHA for the web, API,
semantic ranker, and synthetic probe. The deployment job pulls those images, runs additive Prisma migrations as a preflight, starts the API before routing
traffic, then verifies readiness and a public GraphQL portfolio query over HTTPS.

The VPS records the last verified revision in `.image-sha.current` and copies it to
`.image-sha.previous` before a rollout. `scripts/deploy-production.sh` pulls exact SHA-tagged images,
runs the migration preflight, starts semantic/API/web in order, then the supporting services, and
accepts the revision only after the one-shot synthetic probe verifies public HTTP, readiness,
GraphQL portfolio/quality/GitHub data, and the WebSocket upgrade.

Failed smoke checks automatically invoke `scripts/rollback-production.sh` when a previous revision
exists. Operators can also run `SITE_HOST=... sh scripts/rollback-production.sh [previous-sha]`.
Rollback restores application images and repeats the smoke suite; it intentionally does not reverse
database migrations because the production schema policy is additive-first and forward-compatible.
Destructive migrations are not allowed in the same release that removes application reads.

Required protected-environment values are `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`,
`DEPLOY_HOST_FINGERPRINT`, and `SITE_HOST`. The workflow stages only versioned Compose,
observability, proxy, and deployment scripts; application secrets live only in
`/opt/sskutushev-site/.env.production` on the host and are never copied from CI.
Set the repository variable `PRODUCTION_DEPLOY_ENABLED=true` only after all protected production
values and the target host are provisioned. Until then the production deployment job is explicitly
skipped; a green CI run is not evidence of an external deployment.
