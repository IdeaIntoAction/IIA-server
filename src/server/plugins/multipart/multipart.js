/** @typedef {import('./types').MultipartPlugin} Plugin */
import multipart from '@fastify/multipart';
import fp from 'fastify-plugin';

/** @type Plugin */
const plugin = async (fastify, options) => {
  await fastify.register(multipart, options);
};

export default fp(plugin);
