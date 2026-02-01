FROM node:18-alpine AS build

WORKDIR /app
COPY . .

RUN npm ci
RUN mkdir -p public/images





FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client

COPY --from=build /app ./

EXPOSE 3000

CMD npx sequelize-cli db:migrate \
  && node scripts/databaseInit.js || true \
  && npm start
