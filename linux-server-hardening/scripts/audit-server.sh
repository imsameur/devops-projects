#!/usr/bin/env bash

set -u

echo "=== Linux Server Hardening Audit ==="
echo "Host: $(hostname)"
echo "User: $(whoami)"
echo

echo "[SSH]"
sudo sshd -T | grep -E '^(permitrootlogin|pubkeyauthentication|passwordauthentication|kbdinteractiveauthentication) '
echo

echo "[Firewall]"
sudo firewall-cmd --state
sudo firewall-cmd --zone=public --list-services
echo

echo "[SELinux]"
getenforce
echo

echo "[Users]"
id devopsadmin
echo

echo "[Listening Ports]"
sudo ss -tulpn
