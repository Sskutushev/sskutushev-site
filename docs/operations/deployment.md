# Production deployment and rollback

Production uses immutable GHCR image tags equal to the verified commit SHA for the web, API,
semantic ranker, and synthetic probe. The deployment job pulls those images, runs additive Prisma migrations as a preflight, starts the API before routing
traffic, then verifies readiness and a public GraphQL portfolio query over HTTPS.

The VPS keeps the previous `IMAGE_SHA`. Rollback means restoring that value and running
`docker compose -f docker-compose.production.yml up -d`; schema changes remain forward-compatible.
Destructive migrations are not allowed in the same release that removes application reads.

Required protected-environment values are `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY` and
`SITE_HOST`. Application secrets live only in `/opt/sskutushev-site/.env.production` on the host.
