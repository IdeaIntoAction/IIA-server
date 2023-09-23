/** @typedef {import('json-schema-to-ts')} jsonToTs */
import entities from '../../../prisma/json-schema.js';
import * as schema from '../../lib/schema.js';

const { parser } = entities;

export const parserInputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['site', 'code'],
  properties: {
    site: parser.properties.site,
    code: parser.properties.code,
  },
});

export const parserOutputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['id', 'site', 'code'],
  properties: {
    id: parser.properties.id,
    site: parser.properties.site,
    code: parser.properties.code,
  },
});

export const updateParserInputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['id'],
  properties: {
    id: parser.properties.id,
    site: parser.properties.site,
    code: parser.properties.code,
  },
});

export const deleteParserInputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['id'],
  properties: {
    id: parser.properties.id,
  },
});

export const getParserInputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['id'],
  properties: {
    id: parser.properties.id,
  },
});

export const getParserOutputSchema = parserOutputSchema;

export const listParsersInputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['limit', 'cursor'],
  properties: {
    limit: { type: 'number', minimum: 1 },
    cursor: { type: 'number', minimum: 0 },
  },
});

export const listParsersOutputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['parsers'],
  properties: {
    parsers: { type: 'array', items: parserOutputSchema },
    nextCursor: { type: ['number', 'null'] },
  },
});
