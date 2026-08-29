#!/usr/bin/env sh
set -eu

compose_file="${COMPOSE_FILE:-docker-compose.production.yml}"
current_file="${DEPLOY_STATE_FILE:-.image-sha.current}"
previous_file="${DEPLOY_PREVIOUS_FILE:-.image-sha.previous}"
target="${1:-}"
if [ -z "$target" ] && [ -f "$previous_file" ]; then
  target="$(tr -d '\r\n' < "$previous_file")"
fi
case "$target" in
  ????????????????????????????????????????) ;;
  *) echo "A valid previous immutable image SHA is required" >&2; exit 2 ;;
esac
case "$target" in *[!0-9a-fA-F]*) echo "Rollback SHA must be hexadecimal" >&2; exit 2 ;; esac
: "${SITE_HOST:?SITE_HOST is required}"

export IMAGE_SHA="$target"
docker compose -f "$compose_file" pull
docker compose -f "$compose_file" up -d --wait semantic
docker compose -f "$compose_file" up -d --wait --no-deps api
docker compose -f "$compose_file" up -d --wait --no-deps web
docker compose -f "$compose_file" up -d --wait probe otel-collector prometheus grafana caddy
sh scripts/smoke-production.sh
temporary="${current_file}.tmp"
printf '%s\n' "$target" > "$temporary"
mv "$temporary" "$current_file"
echo "Rollback verified at image $target; database migrations were intentionally not reversed"
