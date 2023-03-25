FROM node:18.15.0-alpine3.16 as dev

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .

RUN yarn build

EXPOSE 8000

CMD ["yarn", "start"]
