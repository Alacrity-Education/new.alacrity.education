#!/usr/bin/env bash
#
# Enforces the retention periods in Section 8 of the privacy policy
# (docs/privacy-policy.md). Neither Payload nor Umami deletes anything on its
# own, so without this the policy describes something that never happens.
#
# The data live in two places, so there are two jobs:
#
#   1. Form submissions older than 3 years. Deleted by the CMS itself, through
#      Payload, so their child rows go with them — this script only asks it to,
#      at /next/purge-expired. The period is set in that route.
#   2. Umami analytics older than 24 months. Deleted here, in Umami's own
#      database, since Umami has no retention setting of its own.
#
# Install on the VM, as root:
#
#   install -m 700 purge-expired.sh /usr/local/sbin/
#   install -m 600 /dev/null /etc/alacrity-retention.env   # then fill it in
#   crontab -e
#     15 3 * * * /usr/local/sbin/purge-expired.sh >> /var/log/purge-expired.log 2>&1
#
# /etc/alacrity-retention.env needs:
#
#   CRON_SECRET=<the value the CMS is deployed with>
#   UMAMI_DB_CONTAINER=<Umami's Postgres container, from `docker ps`>
#
# Run it once with DRY_RUN=1 first. That counts what would go and deletes
# nothing — and it is what tells you whether Umami's tables are where this
# expects them.

set -euo pipefail

ENV_FILE="${ENV_FILE:-/etc/alacrity-retention.env}"
# shellcheck source=/dev/null
[[ -r "$ENV_FILE" ]] && source "$ENV_FILE"

: "${CRON_SECRET:?CRON_SECRET is not set — see $ENV_FILE}"
: "${UMAMI_DB_CONTAINER:?UMAMI_DB_CONTAINER is not set — see $ENV_FILE}"
CMS_URL="${CMS_URL:-https://cms.alacrity.ro}"
UMAMI_DB_USER="${UMAMI_DB_USER:-umami}"
UMAMI_DB_NAME="${UMAMI_DB_NAME:-umami}"
DRY_RUN="${DRY_RUN:-0}"

ANALYTICS_RETENTION='24 months'

log() { printf '%s %s\n' "$(date -u +%FT%TZ)" "$*"; }

# The two jobs are independent: a CMS that is down must not stop the Umami
# purge, or the reverse. Each records its own failure here, and the script
# exits non-zero at the end if either failed.
status=0

# --- 1. Form submissions, via the CMS ---------------------------------------

query=''
[[ "$DRY_RUN" == 1 ]] && query='?dryRun=1'

# Not `log "$(curl ...)"`: errexit does not fire for a substitution used as an
# argument, so a 403 would log an empty line and look like success.
if result="$(curl -fsS -X POST \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  "${CMS_URL}/next/purge-expired${query}")"; then
  log "form submissions: ${result}"
else
  log "form submissions: FAILED (curl exit $?)"
  status=1
fi

# --- 2. Umami, in its own database ------------------------------------------

psql_umami() {
  docker exec -i "$UMAMI_DB_CONTAINER" \
    psql -U "$UMAMI_DB_USER" -d "$UMAMI_DB_NAME" -v ON_ERROR_STOP=1 -qAt "$@"
}

# Refuse to run against a schema this was not written for, rather than delete
# from the wrong place or half the right one.
for table in website_event event_data session session_data; do
  if [[ "$(psql_umami -c "SELECT to_regclass('public.${table}') IS NOT NULL")" != t ]]; then
    log "umami: table ${table} not found, or the database is unreachable — nothing deleted"
    exit 1
  fi
done

if [[ "$DRY_RUN" == 1 ]]; then
  counts="$(psql_umami <<SQL
SELECT 'website_event=' || count(*) FROM website_event WHERE created_at < now() - interval '${ANALYTICS_RETENTION}'
UNION ALL
SELECT 'event_data='    || count(*) FROM event_data    WHERE created_at < now() - interval '${ANALYTICS_RETENTION}'
UNION ALL
SELECT 'session_data='  || count(*) FROM session_data  WHERE created_at < now() - interval '${ANALYTICS_RETENTION}'
UNION ALL
SELECT 'session='       || count(*) FROM session       WHERE created_at < now() - interval '${ANALYTICS_RETENTION}';
SQL
)"
  log "umami (dry run, older than ${ANALYTICS_RETENTION}): ${counts//$'\n'/ }"
  exit "$status"
fi

# One transaction: either every table is purged to the same cutoff or none is.
# Sessions go last, and only those no surviving event still points at.
psql_umami <<SQL
BEGIN;
DELETE FROM event_data    WHERE created_at < now() - interval '${ANALYTICS_RETENTION}';
DELETE FROM session_data  WHERE created_at < now() - interval '${ANALYTICS_RETENTION}';
DELETE FROM website_event WHERE created_at < now() - interval '${ANALYTICS_RETENTION}';
DELETE FROM session s
 WHERE s.created_at < now() - interval '${ANALYTICS_RETENTION}'
   AND NOT EXISTS (SELECT 1 FROM website_event e WHERE e.session_id = s.session_id);
COMMIT;
SQL

log "umami: purged records older than ${ANALYTICS_RETENTION}"

exit "$status"
