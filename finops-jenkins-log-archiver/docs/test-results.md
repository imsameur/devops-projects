# Test Results

Date: 2026-10-19 (BDT)
AWS Region: ap-southeast-1

## Success tests

- Jenkins `finops-log-demo` build #1: SUCCESS.
- EC2 IAM role দিয়ে S3 smoke-test file upload: SUCCESS.
- `jenkins` user দিয়ে archive script run: `Matched: 4, failed: 0`.
- S3 listing-এ চারটি log পাওয়া গেছে:
  - backup-job-1.log
  - backup-job-2.log
  - backup-job-3.log
  - finops-log-demo-1.log

## Failure/recovery test

- শুধু test command-এর PATH থেকে AWS CLI বাদ দিলে script জানিয়েছে:
  `AWS CLI is not installed.` এবং exit code `1`।
- স্বাভাবিক environment-এ `aws --version` আবার কাজ করেছে।

## Cron status

- Timezone: Asia/Dhaka.
- Jenkins user-এর crontab-এ প্রতিদিন 03:00-এর entry আছে।
- Cron service: active.
- Actual scheduled run: NOT YET VERIFIED.
