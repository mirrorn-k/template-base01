FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# ★ ここを入れる
RUN npm run build

EXPOSE 3000

CMD ["npm","run","start"]
