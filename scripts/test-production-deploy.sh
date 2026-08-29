#!/usr/bin/env sh
set -eu

root="$(pwd)"
temporary="$(mktemp -d)"
trap 'rm -rf "$temporary"' EXIT INT TERM
mkdir -p "$temporary/bin"
log="$temporary/docker.log"

cat > "$temporary/bin/docker" <<'EOF'
#!/usr/bin/env sh
printf '%s\n' "$*" >> "$DEPLOY_TEST_LOG"
case "$*" in
  *PROBE_ONCE=true*)
    if [ "${DEPLOY_TEST_FAIL_SMOKE:-false}" = "true" ]; then
      count_file="${DEPLOY_TEST_LOG}.smoke-count"
      count=0
      if [ -f "$count_file" ]; then count="$(cat "$count_file")"; fi
      count=$((count + 1))
      printf '%s\n' "$count" > "$count_file"
      if [ "$count" -le 12 ]; then exit 1; fi
    fi
    ;;
esac
exit 0
EOF
chmod +x "$temporary/bin/docker"
cat > "$temporary/bin/sleep" <<'EOF'
#!/usr/bin/env sh
exit 0
EOF
chmod +x "$temporary/bin/sleep"

export PATH="$temporary/bin:$PATH"
export DEPLOY_TEST_LOG="$log"
export DEPLOY_STATE_FILE="$temporary/current"
export DEPLOY_PREVIOUS_FILE="$temporary/previous"
export COMPOSE_FILE="docker-compose.production.yml"
export SITE_HOST="portfolio.example.com"
export IMAGE_SHA="0123456789abcdef0123456789abcdef01234567"

printf '%s\n' "abcdef0123456789abcdef0123456789abcdef01" > "$DEPLOY_STATE_FILE"
sh "$root/scripts/deploy-production.sh"

test "$(cat "$DEPLOY_STATE_FILE")" = "$IMAGE_SHA"
test "$(cat "$DEPLOY_PREVIOUS_FILE")" = "abcdef0123456789abcdef0123456789abcdef01"
grep -F "compose -f docker-compose.production.yml pull" "$log" >/dev/null
grep -F "compose -f docker-compose.production.yml run --rm --no-deps api pnpm db:migrate" "$log" >/dev/null
grep -F "compose -f docker-compose.production.yml up -d --wait semantic" "$log" >/dev/null
grep -F "compose -f docker-compose.production.yml up -d --wait --no-deps api" "$log" >/dev/null
grep -F "compose -f docker-compose.production.yml up -d --wait --no-deps web" "$log" >/dev/null
grep -F "PROBE_ONCE=true" "$log" >/dev/null

: > "$log"
sh "$root/scripts/rollback-production.sh" "abcdef0123456789abcdef0123456789abcdef01"
test "$(cat "$DEPLOY_STATE_FILE")" = "abcdef0123456789abcdef0123456789abcdef01"
if grep -F "db:migrate" "$log" >/dev/null; then
  echo "Rollback must not reverse or re-run database migrations" >&2
  exit 1
fi

if IMAGE_SHA=mutable-tag sh "$root/scripts/deploy-production.sh" 2>/dev/null; then
  echo "Mutable image tags must be rejected" >&2
  exit 1
fi

old="abcdef0123456789abcdef0123456789abcdef01"
printf '%s\n' "$old" > "$DEPLOY_STATE_FILE"
rm -f "${log}.smoke-count"
if DEPLOY_TEST_FAIL_SMOKE=true sh "$root/scripts/deploy-production.sh" 2>/dev/null; then
  echo "A failed smoke must fail the candidate deployment" >&2
  exit 1
fi
test "$(cat "$DEPLOY_STATE_FILE")" = "$old"
test "$(cat "${log}.smoke-count")" = "13"

echo "Production deployment contract tests passed"
