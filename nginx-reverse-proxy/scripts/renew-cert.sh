#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

docker run --rm \
  -v "$PWD/certbot/www:/var/www/certbot" \
  -v "$PWD/certbot/conf:/etc/letsencrypt" \
  certbot/certbot:latest renew --quiet

docker compose exec -T nginx nginx -t
docker compose exec -T nginx nginx -s reload