FROM node:24-bookworm-slim

WORKDIR /app

COPY app/package.json app/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY app/src ./src
COPY app/data ./data
COPY app/public ./public

ARG APP_VERSION=1.0.0

ENV NODE_ENV=production \
    PORT=3000 \
    SHOP_NAME="Mini Shop" \
    APP_VERSION=${APP_VERSION} \
    HEALTH_FAILURE_FILE=/tmp/mini-shop-unhealthy

USER node

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + process.env.PORT + '/health', {signal: AbortSignal.timeout(3000)}).then(r => process.exit(r.status === 200 ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "src/server.js"]
