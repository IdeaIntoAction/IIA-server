/** @typedef {import('../types').HTTPRoute} HttpRoute */

/** @type HttpRoute */
const transfer = {
  method: 'POST',
  url: '/transfer',
  inputSource: 'body',
  command: { service: 'account', method: 'transfer' },
};

/** @type HttpRoute */
const balance = {
  method: 'GET',
  url: '/balance',
  inputSource: 'query',
  command: { service: 'account', method: 'getBalance' },
};

export default [transfer, balance];
