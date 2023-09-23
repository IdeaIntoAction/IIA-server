/** @typedef {import('../types').HTTPRoute} HttpRoute */

/** @type HttpRoute */
export const createParser = {
  method: 'POST',
  url: '/create',
  inputSource: 'body',
  command: { service: 'parser', method: 'createParser' },
};

/** @type HttpRoute */
export const updateParser = {
  method: 'PUT',
  url: '/update',
  inputSource: 'body',
  command: { service: 'parser', method: 'updateParser' },
};

/** @type HttpRoute */
export const deleteParser = {
  method: 'DELETE',
  url: '/delete',
  inputSource: 'body',
  command: { service: 'parser', method: 'deleteParser' },
};

/** @type HttpRoute */
export const getParser = {
  method: 'GET',
  url: '/',
  inputSource: 'query',
  command: { service: 'parser', method: 'getParser' },
};

/** @type HttpRoute */
export const listParsers = {
  method: 'GET',
  url: '/all',
  inputSource: 'query',
  command: { service: 'parser', method: 'listParsers' },
};
