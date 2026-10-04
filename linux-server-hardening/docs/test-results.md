# Test Results

Environment: AWS EC2, Amazon Linux 2023
Test date: 2026-10-04

| Test | Observed result | Status |
| --- | --- | --- |
| SSH configuration syntax | sshd -t completed without errors | PASS |
| Admin SSH key login after reboot | whoami returned devopsadmin | PASS |
| Root SSH login | Permission denied | PASS |
| Login without a public key | Permission denied; password and keyboard-interactive were not offered | PASS |
| Admin group membership | devopsadmin belongs to wheel | PASS |
| Admin sudo policy | sudo -l -U devopsadmin showed (ALL) ALL | PASS |
| SSH service after reboot | active | PASS |
| Firewalld after reboot | active | PASS |
| Firewall interface after reboot | ens5 assigned to public | PASS |
| Firewall services after reboot | dhcpv6-client ssh | PASS |
| SELinux after reboot | Enforcing | PASS |
| Persistent SELinux configuration | enforcing | PASS |
| TCP listeners before reboot | SSH on port 22; VS Code listeners on loopback only | PASS |
| Audit script execution | Displayed SSH, firewall, SELinux, user and socket information | PASS |

## Scope and limitations

- The audit script reports current settings for manual review.
  It does not automatically calculate PASS/FAIL.
- Local firewall output does not verify AWS Security Group rules.
- A connection timeout is not evidence of authentication rejection.
- These checks validate this lab's configuration, not full security compliance.
