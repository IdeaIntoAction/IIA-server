/** @typedef {import('../types').API['http']} API */
import * as auth from './auth.js';
import * as parser from './parser.js';
import * as uploader from './uploader.js';

/** @type API */
export const http = { auth, parser, uploader };
