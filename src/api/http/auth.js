/** @typedef {import('../types').HTTPRoute} HttpRoute */
import * as schemaUtils from '../../lib/schema.js';

/** @type HttpRoute */
const signUp = {
  method: 'POST',
  url: '/sign-up',
  input: {
    source: 'body',
    required: ['email', 'password', 'firstName', 'lastName'],
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
    },
  },
  output: schemaUtils.toObject({
    required: ['userId', 'token'],
    properties: {
      userId: { type: 'string' },
      token: { type: 'string' },
    },
  }),
  command: { service: 'auth', method: 'signUp' },
};

/** @type HttpRoute */
const signIn = {
  method: 'POST',
  url: '/sign-in',
  input: {
    source: 'body',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
  output: schemaUtils.toObject({
    required: ['userId', 'token'],
    properties: {
      userId: { type: 'string' },
      token: { type: 'string' },
    },
  }),
  command: { service: 'auth', method: 'signIn' },
};

/** @type HttpRoute */
const signOut = {
  method: 'POST',
  url: '/sign-out',
  input: {
    source: 'body',
    required: ['token'],
    properties: { token: { type: 'string' } },
  },
  command: { service: 'auth', method: 'signOut' },
};

/** @type HttpRoute */
const refresh = {
  method: 'POST',
  url: '/refresh',
  input: {
    source: 'body',
    required: ['token'],
    properties: { token: { type: 'string' } },
  },
  output: schemaUtils.toObject({
    required: ['token'],
    properties: { token: { type: 'string' } },
  }),
  command: { service: 'auth', method: 'refresh' },
};

export default [signUp, signIn, signOut, refresh];