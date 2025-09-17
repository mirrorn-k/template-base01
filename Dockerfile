# ベースイメージとしてNode.jsを使用
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピーし、依存関係をインストール
COPY package*.json ./
RUN npm install

# ソースコードをコンテナにコピー
COPY . .

# ポートを公開
EXPOSE 3000

# 起動コマンドを環境に応じて切り替え
# CMD [ "sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run start; else npm run dev; fi" ]
