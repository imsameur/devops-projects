# Restore Test

## Purpose

Verify that files can be restored from a timestamped backup.

## Restore command

Replace the backup folder name below with the backup you want to restore.

```bash
mkdir -p "$HOME/backup-lab/restore-test"
rsync -a "$HOME/backup-lab/backups/backup_20261005_002257/" \
  "$HOME/backup-lab/restore-test/"
```

## Compare restored files with the source

```bash
diff -r "$HOME/backup-lab/source" "$HOME/backup-lab/restore-test"
```

No output from `diff` means the restored files match the source.

## Result

PASS: `app.conf` and `notes.txt` were restored and matched the source files.
