FROM node:18.15.0-alpine3.16 as dev
WORKDIR /app
ENV NODE_ENV=development
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY ./prisma /app/prisma
COPY src ./src
COPY ./.env /app/
RUN yarn install
RUN yarn build
EXPOSE 8000
CMD yarn build && yarn start

FROM dev as prod
ENV NODE_ENV=production

