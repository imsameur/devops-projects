# Access Recovery Guide

## 1. Identify the failure

- Connection timed out: check the instance state, public IP,
  Security Group source, network path and host firewall.
- Permission denied: the SSH server was reached.
  Check the username, key, file permissions and SSH policy.

Keep a working SSH session open while changing access settings.
Verify a new connection before closing it.

## 2. Security Group source mismatch

From an existing server SSH session:

```bash
echo "$SSH_CONNECTION"
```

The first address is the client IP observed by the server.
Allow that address with /32 for inbound TCP port 22.
A changing client public IP requires updating the rule.
The browser's detected IP may differ from the SSH connection's IP.

Test a new connection after saving the rule.

## 3. Inspect SSH

Run through an existing administrative session:

```bash
sudo /usr/sbin/sshd -t
sudo systemctl status sshd --no-pager
sudo journalctl -u sshd -n 50 --no-pager
```

Correct configuration errors before reloading:

```bash
sudo /usr/sbin/sshd -t && sudo systemctl reload sshd
```

The pre-change SSH backup for this lab is:
`/etc/ssh.backup-project01`

Compare the affected files with the backup before restoring them.
Restoring old settings may undo hardening.
Never publish this backup: it contains SSH host private keys.

## 4. Inspect the host firewall

```bash
sudo firewall-cmd --get-active-zones
sudo firewall-cmd --zone=public --list-all
sudo firewall-cmd --permanent --zone=public --list-all
```

For this lab, ens5 should belong to public and ssh should be allowed.
If SSH is missing from that zone, restore it:

```bash
sudo firewall-cmd --zone=public --add-service=ssh
sudo firewall-cmd --permanent --zone=public --add-service=ssh
```

## 5. Inspect key permissions and SELinux

```bash
sudo ls -ld /home/devopsadmin/.ssh
sudo ls -l /home/devopsadmin/.ssh/authorized_keys
sudo restorecon -Rv /home/devopsadmin/.ssh
sudo ausearch -m AVC,USER_AVC -ts recent
```

Expected ownership: devopsadmin:devopsadmin.
Expected permissions: .ssh = 700, authorized_keys = 600.
Investigate relevant SELinux denials while keeping enforcing enabled.

## 6. If no SSH session works

Fix an incorrect Security Group source through the AWS console first.

Session Manager is an alternative only if its IAM permissions,
agent and network connectivity are configured.
A running SSM agent alone does not prove Session Manager is available.

For host-side failures without an alternative session, use an
applicable EC2 recovery method, such as a supported EC2 Serial Console
or offline root-volume repair.

Recovery procedures are documented here; a full lockout recovery
drill was not performed.
