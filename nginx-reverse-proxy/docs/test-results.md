# Project 06 — Test Results

Test date: 2026-10-03
Environment: AWS EC2, Amazon Linux 2023, Docker Compose
Domain: shop.sameur.bd

| Test | Observed result | Status |
|---|---|---|
| Compose configuration | Validation exited with code 0 | PASS |
| Nginx configuration | Syntax check successful | PASS |
| HTTP reverse proxy | Health endpoint returned 200 | PASS |
| Browser access | Mini Shop and products loaded | PASS |
| Database write through proxy | POST /api/notes returned 201 | PASS |
| Database read through proxy | GET /api/notes returned 200 with saved note | PASS |
| App outage | Stopping app caused Nginx to return 502 | PASS |
| App recovery | Health returned 200 after app startup; saved note remained | PASS |
| DNS resolution | shop.sameur.bd resolved to the EC2 public IP | PASS |
| ACME challenge route | Test file returned 200 with expected text | PASS |
| TLS certificate issuance | Let's Encrypt certificate obtained | PASS |
| HTTPS health | Returned 200; app healthy and database up | PASS |
| HTTP redirect | Returned 301 to the matching HTTPS URL | PASS |
| Browser TLS verification | Browser displayed "Connection is secure" | PASS |
| HTTPS database write/read | POST returned 201; GET returned 200 with new note | PASS |
| Certificate renewal simulation | All simulated renewals succeeded | PASS |
| Renewal script | Nginx validation and reload succeeded; exit code 0 | PASS |
| Renewal systemd service | Manual execution completed successfully | PASS |
| Renewal timer setup | Enabled with a next scheduled execution | PASS |
| Secret exclusion | .env and certificate private key ignored by Git | PASS |
| Build context exclusion | certbot/ excluded by .dockerignore | PASS |

## Notes

- The app outage test was performed before HTTPS was enabled.
- Renewal was tested using a dry run. A scheduled renewal has not yet
  been observed.
- The renewal script reloads Nginx after a successful Certbot check,
  including when no certificate is due for renewal.
- Only Nginx publishes application-facing host ports: 80 and 443.
  Node.js and MongoDB do not publish host ports.