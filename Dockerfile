FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

COPY package.json package-lock.json ./
COPY server ./server
COPY functions ./functions
COPY assets ./assets
COPY icons ./icons
COPY *.html *.js *.css *.ico *.webp *.jpg ./

USER node

EXPOSE 8080

CMD ["node", "server/server.mjs"]
