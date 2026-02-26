FROM node:20-alpine

WORKDIR /app

# frontend 配下の package.json を使う
COPY frontend/package*.json ./
RUN npm ci

# ソースコピー
COPY frontend/ ./

ARG ENV_FILE
COPY ${ENV_FILE} /app/.env.build

RUN set -a \
    && . /app/.env.build \
    && set +a \
    && npm run build
    
CMD ["npm","run","start"]