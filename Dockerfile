FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache git python3 make g++ cairo-dev jpeg-dev pango-dev musl-dev vips-dev
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 10000
CMD ["node", "index.js"]