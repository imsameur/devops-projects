#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${1:-$SCRIPT_DIR/config.example}"

if [[ ! -f "$CONFIG_FILE" ]]; then
  echo "ERROR: config.example not found"
  exit 1
fi

source "$CONFIG_FILE"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "ERROR: Source directory not found: $SOURCE_DIR"
  exit 1
fi

if [[ ! "${RETENTION_DAYS:-}" =~ ^[1-9][0-9]*$ ]]; then
  echo "ERROR: RETENTION_DAYS must be a positive number"
  exit 1
fi

mkdir -p "$BACKUP_ROOT" "$(dirname "$LOG_FILE")"

TIMESTAMP="$(date '+%Y%m%d_%H%M%S')"
BACKUP_DIR="$BACKUP_ROOT/backup_$TIMESTAMP"
TEMP_DIR="$BACKUP_ROOT/.in-progress-$TIMESTAMP"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" | tee -a "$LOG_FILE"
}

log "Backup started: $SOURCE_DIR"

if ! mkdir "$TEMP_DIR"; then
  log "ERROR: Could not create temporary backup directory"
  exit 1
fi

if rsync -a "$SOURCE_DIR/" "$TEMP_DIR/"; then
  if mv "$TEMP_DIR" "$BACKUP_DIR"; then
  while IFS= read -r OLD_BACKUP; do
    if rm -rf -- "$OLD_BACKUP"; then
      log "Removed expired backup: $OLD_BACKUP"
    else
      log "ERROR: Could not remove expired backup: $OLD_BACKUP"
      exit 1
    fi
  done < <(find "$BACKUP_ROOT" -mindepth 1 -maxdepth 1 \
    -type d -name 'backup_????????_??????' \
    -mmin "+$((RETENTION_DAYS * 1440))" -print)

  log "SUCCESS: Backup created at $BACKUP_DIR"
  exit 0
  else
    log "ERROR: Could not finalize backup directory"
    exit 1
  fi
else
  RSYNC_STATUS=$?
  rm -rf -- "$TEMP_DIR"
  log "ERROR: rsync failed with exit code $RSYNC_STATUS"
  exit "$RSYNC_STATUS"
fi
