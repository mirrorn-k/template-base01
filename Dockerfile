FROM node:20-alpine

WORKDIR /app

# frontend 配下の package.json を使う
COPY frontend/package*.json ./
RUN npm ci

# ソースコピー
COPY frontend/ ./

# サービスごとの env を受け取る
ARG ENV_FILE
COPY ${ENV_FILE} /app/.env.build

# build時にenvを読み込む
RUN export $(cat /app/.env.build | xargs) \
    && npm run build

CMD ["npm","run","start"]