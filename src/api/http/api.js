/** @typedef {import('../types').API['http']} API */
import * as auth from './auth.js';
import * as post from './post.js';
import * as uploader from './uploader.js';

/** @type API */
export const http = { auth, post, uploader };
