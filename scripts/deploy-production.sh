#!/usr/bin/env sh
set -eu

compose_file="${COMPOSE_FILE:-docker-compose.production.yml}"
current_file="${DEPLOY_STATE_FILE:-.image-sha.current}"
previous_file="${DEPLOY_PREVIOUS_FILE:-.image-sha.previous}"

case "${IMAGE_SHA:-}" in
  ????????????????????????????????????????) ;;
  *) echo "IMAGE_SHA must be the exact 40 character Git commit revision" >&2; exit 2 ;;
esac
case "$IMAGE_SHA" in *[!0-9a-fA-F]*) echo "IMAGE_SHA must be hexadecimal" >&2; exit 2 ;; esac
: "${SITE_HOST:?SITE_HOST is required}"

previous=""
if [ -f "$current_file" ]; then
  previous="$(tr -d '\r\n' < "$current_file")"
  printf '%s\n' "$previous" > "$previous_file"
fi

rollback() {
  status=$?
  trap - EXIT INT TERM
  if [ "$status" -ne 0 ] && [ -n "$previous" ]; then
    echo "Deployment failed; restoring image $previous" >&2
    IMAGE_SHA="$previous" sh scripts/rollback-production.sh "$previous" || true
  fi
  exit "$status"
}
trap rollback EXIT INT TERM

docker compose -f "$compose_file" pull
docker compose -f "$compose_file" run --rm --no-deps api pnpm db:migrate
docker compose -f "$compose_file" run --rm --no-deps resume-sync
docker compose -f "$compose_file" up -d --wait semantic
docker compose -f "$compose_file" up -d --wait --no-deps api
docker compose -f "$compose_file" up -d --wait --no-deps web
docker compose -f "$compose_file" up -d --wait probe otel-collector prometheus grafana caddy
sh scripts/smoke-production.sh

temporary="${current_file}.tmp"
printf '%s\n' "$IMAGE_SHA" > "$temporary"
mv "$temporary" "$current_file"
trap - EXIT INT TERM
echo "Production rollout verified at image $IMAGE_SHA"
