# Test Results

| Test | Command | Result |
|---|---|---|
| Bash syntax check | `bash -n monitor.sh` | PASS |
| Normal health check | `./monitor.sh` | PASS, status `OK`, exit code `0` |
| Warning condition | `CPU_THRESHOLD=0 MEMORY_THRESHOLD=1 DISK_THRESHOLD=1 bash monitor.sh` | PASS, warnings shown, exit code `1` |
| Executable permission | `./monitor.sh` | PASS |

The warning test temporarily overrides thresholds in the command. The default threshold in the script remains 80%.
