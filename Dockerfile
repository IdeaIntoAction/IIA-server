FROM node:18.15.0-alpine3.16

WORKDIR /app

COPY package.json yarn.lock .env.example ./
RUN yarn install --frozen-lockfile
COPY . .

RUN yarn build

EXPOSE 8000

CMD ["yarn", "start"]
