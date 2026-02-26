FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG ENV_FILE
COPY ${ENV_FILE} /app/.env.build

RUN export $(cat /app/.env.build | xargs) \
    && npm run build

CMD ["npm","run","start"]