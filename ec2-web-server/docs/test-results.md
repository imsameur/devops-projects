# Test Results

Test date: 2026-10-05

## Verification summary

| Test | Expected result | Result |
| --- | --- | --- |
| Initial browser access | Sample website loads over HTTP | PASS |
| Bootstrap completion | cloud-init reports done and success message appears in logs | PASS |
| Nginx service | active and enabled | PASS |
| Nginx configuration | nginx -t succeeds | PASS |
| Local HTTP request | HTTP 200 OK | PASS |
| Website customization | Updated title, heading and description appear | PASS |
| Failure test | Stopping Nginx makes HTTP access fail | PASS |
| Recovery test | Restarting Nginx restores website access | PASS |
| Reboot test | Nginx starts automatically and website remains available | PASS |
| Bootstrap script syntax | bash -n user-data.sh exits with code 0 | PASS |

Failure and recovery results were confirmed by the operator.
Bootstrap and post-reboot command outputs were also reviewed.

## Bootstrap evidence

- cloud-init status: done
- Nginx state: active
- Nginx startup: enabled
- Nginx configuration test: successful
- HTTP response: 200 OK
- Log message: Project 07 bootstrap completed successfully

## Failure and recovery procedure

1. Stop Nginx with sudo systemctl stop nginx.
2. Check service state with systemctl is-active nginx.
3. Check port 80 with sudo ss -ltnp 'sport = :80'.
4. Test HTTP with curl -I --max-time 5 http://localhost.
5. Review logs with sudo journalctl -u nginx -n 15 --no-pager.
6. Restart Nginx with sudo systemctl restart nginx.
7. Confirm active state, port 80 listener and HTTP 200 OK.
8. Confirm browser access is restored.

## Reboot evidence

Boot ID before reboot:
cc38cf35-c121-4743-b543-52c933f38898

Boot ID after reboot:
a42c4eeb-53f7-42d8-a241-50e3858ef8b6

The boot ID changed. After reconnecting, Nginx was active and enabled,
localhost returned HTTP 200 OK, and the browser website was available.

## Website and script versions

The original user data deployed the website successfully.
The website title and heading were then customized on the server.
The final user-data.sh embeds the customized HTML and passed a Bash
syntax check. A fresh EC2 launch using this final script was not tested.
