/** @typedef {import('json-schema-to-ts')} jsonToTs */
import entities from '../../../prisma/json-schema.js';
import * as schema from '../../lib/schema.js';

const { post } = entities;

export const postInputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['title', 'content'],
  properties: {
    title: post.properties.title,
    content: post.properties.content,
  },
});

export const postOutputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['id', 'title', 'content'],
  properties: {
    id: post.properties.id,
    title: post.properties.title,
    content: post.properties.content,
  },
});

export const updatePostInputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['id'],
  properties: {
    id: post.properties.id,
    title: post.properties.title,
    content: post.properties.content,
  },
});

export const deletePostInputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['id'],
  properties: {
    id: post.properties.id,
  },
});

export const getPostInputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['id'],
  properties: {
    id: post.properties.id,
  },
});

export const getPostOutputSchema = postOutputSchema;

export const listPostsInputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['limit', 'offset'],
  properties: {
    page: { type: 'number', minimum: 1 },
    pageSize: { type: 'number', minimum: 1 },
  },
});

export const listPostsOutputSchema = /** @type {const} */ ({
  ...schema.strictObjectProperties,
  required: ['posts', 'total'],
  properties: {
    posts: { type: 'array', items: postOutputSchema },
    total: { type: 'number', minimum: 0 },
  },
});
