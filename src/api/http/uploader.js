/** @typedef {import('../types').HTTPRoute} HttpRoute */

/** @type HttpRoute */
export const uploadImage = {
  method: 'POST',
  url: '/',
  inputSource: 'body',
  command: { service: 'uploader', method: 'uploadImage' },
};
