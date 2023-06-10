import * as schema from '../../lib/schema.js';

export const imageUploaderInputSchema = /** @type {const} */ ({
  type: 'object',
  required: ['image'],
  properties: {
    image: {
      type: 'object',
    },
  },
});

export const imageUploaderOutputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['link'],
  properties: {
    link: { type: 'string' },
  },
});
