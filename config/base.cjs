/* eslint-disable @typescript-eslint/no-var-requires */
const { config } = require('dotenv');
const crypto = require('crypto');

config();

const host = process.env.SERVER_HOST ?? '0.0.0.0';
const port = process.env.SERVER_PORT;

module.exports = {
  base: {
    nodeEnv: process.env.NODE_ENV,
    logLevel: process.env.LOG_LEVEL,
  },
  server: {
    host,
    port,
    serverId: crypto.randomUUID(),
    enabledApi: { http: true, ws: true },
    healthCheckUrl: '/',
    cors: {
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
      credentials: true,
    },
    auth: {},
    swagger: {
      title: 'IIA API',
      description: 'API docs for IIA project',
      version: '1.0',
      serverUrl: process.env.SERVER_URL ?? `http://${host}:${port}`,
      routePrefix: '/docs',
    },
  },
  infra: {
    logger: { env: process.env.LOG_LEVEL },
    db: { errorFormat: 'minimal' },
    redis: {
      url: process.env.REDIS_URL,
    },
    bus: { type: 'local' },
  },
  services: {
    enabledServices: process.env.ENABLED_SERVICES?.split(';') ?? 'all',
  },
};
