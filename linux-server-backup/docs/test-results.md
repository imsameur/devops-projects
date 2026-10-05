# Test Results

| Test | Result |
|---|---|
| Bash syntax check with `bash -n backup.sh` | PASS |
| Manual backup created with timestamp | PASS |
| Backup files matched the source using `diff -r` | PASS |
| Restore to a separate directory | PASS |
| Restored files matched the source using `diff -r` | PASS |
| Invalid source path returned a failure | PASS |
| Backup older than 7 days was removed | PASS |
| Cron ran the backup automatically | PASS |

Cron test log showed successful runs at 01:32, 01:33, and 01:34 server time.
The active schedule is daily at 02:00 Asia/Dhaka.
