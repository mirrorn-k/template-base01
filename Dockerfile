FROM node:20-alpine

WORKDIR /app

# ソースコピー
COPY . .
RUN npm ci --ignore-scripts

RUN npm run build
    
CMD ["npm","run","start"]