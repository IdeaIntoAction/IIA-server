/** @typedef {import('../types').HTTPRoute} HttpRoute */

/** @type HttpRoute */
export const createPost = {
  method: 'POST',
  url: '/create',
  inputSource: 'body',
  command: { service: 'post', method: 'createPost' },
};

/** @type HttpRoute */
export const updatePost = {
  method: 'PUT',
  url: '/update',
  inputSource: 'body',
  command: { service: 'post', method: 'updatePost' },
};

/** @type HttpRoute */
export const deletePost = {
  method: 'DELETE',
  url: '/delete',
  inputSource: 'body',
  command: { service: 'post', method: 'deletePost' },
};

/** @type HttpRoute */
export const getPost = {
  method: 'GET',
  url: '/',
  inputSource: 'query',
  command: { service: 'post', method: 'getPost' },
};

/** @type HttpRoute */
export const listPosts = {
  method: 'GET',
  url: '/all',
  inputSource: 'query',
  command: { service: 'post', method: 'listPosts' },
};
