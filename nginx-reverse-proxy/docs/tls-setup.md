# TLS Setup on a Fresh Server

Run commands from the nginx-reverse-proxy directory.

## Prerequisites

- Docker and Docker Compose are installed.
- The application environment file `.env` is configured.
- An A record for shop.sameur.bd points to the server's public IPv4.
- Cloudflare DNS is set to DNS only for this setup.
- The EC2 security group allows inbound TCP 80 and 443.
- SSH access is restricted to the administrator's IP or approved range.

If using a different domain, replace shop.sameur.bd in the
configuration and commands.

## 1. Prepare directories and temporary HTTP configuration

The final nginx.conf references certificates that do not exist yet.
Back it up before using a temporary HTTP-only configuration.

```bash
mkdir -p certbot/www certbot/conf
cp nginx.conf certbot/nginx.https.conf.backup

cat > nginx.conf <<'EOF'
server {
    listen 80;
    server_name shop.sameur.bd;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
        default_type text/plain;
        try_files $uri =404;
    }

    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

docker compose up -d --build --wait --wait-timeout 180
```

## 2. Verify the challenge route

```bash
mkdir -p certbot/www/.well-known/acme-challenge
echo "project06-acme-ok" > certbot/www/.well-known/acme-challenge/test-file

curl -i http://shop.sameur.bd/.well-known/acme-challenge/test-file
```

Expect HTTP 200 and `project06-acme-ok`.

## 3. Obtain the certificate

```bash
docker run --rm -it \
  -v "$PWD/certbot/www:/var/www/certbot" \
  -v "$PWD/certbot/conf:/etc/letsencrypt" \
  certbot/certbot:latest certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  --domain shop.sameur.bd
```

Follow the interactive prompts. Continue only after certificate
issuance succeeds.

## 4. Enable HTTPS

Restore the final configuration and recreate Nginx so it uses the
restored bind-mounted file.

```bash
cp certbot/nginx.https.conf.backup nginx.conf

docker compose run --rm --no-deps nginx nginx -t &&
docker compose up -d --no-deps --force-recreate nginx
```

Verify:

```bash
curl -I http://shop.sameur.bd/health
curl -i https://shop.sameur.bd/health
```

Expect an HTTP 301 redirect and an HTTPS 200 healthy response.

## 5. Test renewal

```bash
docker run --rm \
  -v "$PWD/certbot/www:/var/www/certbot" \
  -v "$PWD/certbot/conf:/etc/letsencrypt" \
  certbot/certbot:latest renew --dry-run
```

Expect all simulated renewals to succeed.

## 6. Install automatic renewal

The provided service uses ec2-user and this project path:

`/home/ec2-user/devops-projects/nginx-reverse-proxy`

Update the service file if your username or project path differs.

```bash
chmod +x scripts/renew-cert.sh
sudo cp systemd/project06-cert-renew.service /etc/systemd/system/
sudo cp systemd/project06-cert-renew.timer /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl start project06-cert-renew.service
sudo systemctl enable --now project06-cert-renew.timer
sudo systemctl list-timers --all project06-cert-renew.timer
```

Check execution logs:

```bash
sudo journalctl -u project06-cert-renew.service -n 30 --no-pager
```

The timer checks twice daily with a randomized delay of up to one hour.
Certbot renews only when needed. The script validates and reloads Nginx
after each successful check.

Keep port 80 and the ACME challenge route available for renewal.
The server must remain running and DNS must point to it.

## Certificate storage

Certificates and private keys are stored under `certbot/conf/`.
The entire `certbot/` directory is excluded from Git and Docker builds.
Never commit these files.