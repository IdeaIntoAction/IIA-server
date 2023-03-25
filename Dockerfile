# 1st stage - development
FROM node:18.15.0-alpine3.16 as dev
WORKDIR /app

ENV NODE_ENV=development

COPY package.json yarn.lock tsconfig.json ./
RUN yarn install --frozen-lockfile

COPY ./prisma /app/prisma
COPY src ./src
COPY .env.schema /app/
COPY ./.env /app/

RUN yarn build

EXPOSE 8000

CMD yarn start

# 2nd stage - production
FROM node:18.15.0-alpine3.16 as prod

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY ./prisma /app/prisma
COPY src ./src
COPY ./.env /app/

COPY --from=dev /app/dist /app/dist

CMD ["node", "./dist/index.js"]
