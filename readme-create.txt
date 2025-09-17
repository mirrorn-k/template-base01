# 1. Next.js プロジェクトを作成（React/TypeScript/ESLint入り）
npx create-next-app@15 ./frontend --typescript --eslint --use-npm --no-tailwind --src-dir --import-alias "@/*"

cd frontend

# 2. addonem.com と同じ依存関係を追加
npm install \
  @emotion/cache@^11.14.0 \
  @emotion/react@^11.14.0 \
  @emotion/styled@^11.14.0 \
  @fontsource/noto-sans-jp@^5.1.1 \
  @fontsource/shippori-mincho@^5.1.1 \
  @mui/icons-material@^6.3.0 \
  @mui/material@^6.4.2 \
  @types/node@^20.17.24 \
  axios@^1.7.9 \
  deepmerge@^4.3.1 \
  dotenv@^16.4.7 \
  loglevel@^1.9.2 \
  next-sitemap@^4.2.3 \
  node-fetch@^3.3.2 \
  tsconfig-paths@^4.2.0 \
  typescript@^5

# 3. 開発用依存関係
npm install -D \
  @eslint/eslintrc@^3 \
  eslint@^9 \
  eslint-config-next@15.1.2
