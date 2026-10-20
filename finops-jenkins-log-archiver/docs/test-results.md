# Test Results

Manual test date: 2026-10-19 (BDT)
Scheduled cron verification: 2026-10-20 (BDT)
AWS Region: `ap-southeast-1`

## Success Tests

- Jenkins `finops-log-demo` build #1 completed with `SUCCESS`.
- An S3 smoke-test file was uploaded from EC2 using the instance IAM role.
- The archive script, run as the `jenkins` user, reported `Matched: 4, failed: 0`.
- The S3 object listing showed four archived build logs:
  - `backup-job-1.log`
  - `backup-job-2.log`
  - `backup-job-3.log`
  - `finops-log-demo-1.log`

## Failure and Recovery Test

- AWS CLI was hidden from the script for one test process by overriding `PATH`. The script printed `AWS CLI is not installed.` and exited with status `1`.
- In the normal environment, `aws --version` worked afterward. AWS CLI was not uninstalled.
- This test covers the missing-CLI case, not an S3 permission or network failure.

## Scheduled Cron Verification

- EC2 timezone: `Asia/Dhaka`.
- The `jenkins` user's crontab schedules the archive script daily at 03:00 BDT.
- The cron service was `active`.
- On 2026-10-20 at **03:00:01 BDT**, the system journal recorded a `(jenkins) CMD` entry for `/usr/local/bin/finops-jenkins-archive-logs.sh`.
- The cron output reported four uploads and `Matched: 4, failed: 0` for logs selected from 2026-10-19 BDT.
- Evidence: [scheduled cron execution screenshot](screenshots/05-cron-execution.png).

The S3 listing verifies that the objects exist; their contents were not independently downloaded or compared. Cost savings against ELK have not been measured.
