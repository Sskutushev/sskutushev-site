#!/usr/bin/env sh
set -eu

compose_file="${COMPOSE_FILE:-docker-compose.production.yml}"
: "${SITE_HOST:?SITE_HOST is required}"

attempt=1
while [ "$attempt" -le 12 ]; do
  if docker compose -f "$compose_file" run --rm --no-deps \
    -e PROBE_ONCE=true \
    -e SITE_URL="https://${SITE_HOST}" \
    -e API_URL="https://${SITE_HOST}" \
    probe; then
    exit 0
  fi
  if [ "$attempt" -eq 12 ]; then
    echo "Production smoke failed after $attempt attempts" >&2
    exit 1
  fi
  attempt=$((attempt + 1))
  sleep 5
done
