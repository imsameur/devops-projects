# Project 05 Test Results

Test date: 2026-09-28
Environment: AWS EC2 t3.small, Amazon Linux 2023
Application image: mini-shop-notes:1.1.0

## Verification summary

| Test | Observed result | Status |
| --- | --- | --- |
| Compose configuration | Validation exit code 0 | PASS |
| Image build and startup | App and MongoDB became healthy | PASS |
| Application health | HTTP 200; healthy; database up | PASS |
| Create note | HTTP 201 with ID and timestamp | PASS |
| List notes | HTTP 200 with the saved document | PASS |
| Container recreation | Original note ID and timestamp retained | PASS |
| Database outage | Health and notes endpoints returned HTTP 503 | PASS |
| Database recovery | HTTP 200 restored without restarting the app | PASS |
| Whitespace-only note | HTTP 400; rejected | PASS |
| Numeric note text | HTTP 400; rejected | PASS |
| Malformed JSON | HTTP 400; Invalid JSON request body | PASS |
| Invalid requests persisted | No additional notes appeared | PASS |
| Cart unit tests | 4 passed, 0 failed; exit code 0 | PASS |
| Browser product listing | All four products displayed | PASS |
| Browser cart calculation | Two mice and one keyboard total BDT 5,200 | PASS |
| Browser health via SSH tunnel | healthy; database up | PASS |
| MongoDB host port publishing | No host port mapping in Compose status | PASS |

## Automated test command

Run from the docker-nodejs-mongodb directory on the Linux host:

```bash
docker run --rm \
  --name project05-tests \
  --memory=512m \
  --memory-swap=512m \
  --cpus=1 \
  --user "$(id -u):$(id -g)" \
  -e npm_config_cache=/tmp/npm-cache \
  -v "$PWD/app:/app" \
  -w /app \
  node:24-bookworm-slim \
  sh -c 'npm ci --no-audit --no-fund && npm test'
```

Verified unit tests:
- Two mice and one keyboard total 5,200 BDT.
- Empty cart totals zero.
- Unknown product is rejected.
- Invalid quantities are rejected.

The four automated tests cover cart logic. Notes API, persistence,
outage recovery and browser behavior were tested manually.

## Evidence

- [Persistence and recovery procedure](persistence-test.md)
- [Mini Shop browser screenshot](screenshots/01-mini-shop.png)
- [Health endpoint screenshot](screenshots/02-health.png)

## Troubleshooting during the lab

### Missing Buildx plugin

Compose build reported that Buildx 0.17.0 or later was required.
Installed Buildx v0.17.1 and verified its version.
The subsequent image build and stack startup succeeded.

### SSH became unresponsive

VS Code Remote SSH stalled, and a direct SSH connection timed out
during banner exchange. EC2 system, instance and EBS checks passed.

An EC2 reboot restored SSH access. After reboot:
- Approximately 1.2 GiB RAM was available.
- Root disk usage was 25%.
- The filtered previous-boot kernel logs contained no matching
  out-of-memory or blocked-process entries.

The root cause was not established. Automated tests subsequently
passed through a direct SSH session with a resource-limited container.
