FROM node:20-alpine

WORKDIR /app

# ソースコピー
COPY . .
RUN npm ci --ignore-scripts


ARG ENV_FILE
COPY ${ENV_FILE} /app/.env

RUN set -a \
    && . /app/.env \
    && set +a \
    && npm run build
    
CMD ["npm","run","start"]