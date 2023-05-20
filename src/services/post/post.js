/** @typedef {import('./types').PostCommands} Commands */
import { ServiceError } from '../error.js';
import {
  postInputSchema,
  postOutputSchema,
  updatePostInputSchema,
  deletePostInputSchema,
  getPostInputSchema,
  getPostOutputSchema,
  listPostsInputSchema,
  listPostsOutputSchema,
} from './schema.js';

/** @type Commands['createPost'] */
const createPost = {
  auth: {},
  input: postInputSchema,
  output: postOutputSchema,
  handler: async (infra, { data: { title, content }, meta: { userId } }) => {
    const { db } = infra;

    const author = await db.user.findUnique({ where: { id: userId } });
    const post = await db.post.create({
      data: { title, content, author: { connect: { id: author?.id } } },
    });

    return post;
  },
};

/** @type Commands['updatePost'] */
const updatePost = {
  input: updatePostInputSchema,
  output: postOutputSchema,
  handler: async (infra, { data: { id, title, content } }) => {
    const { db } = infra;

    const post = await db.post.update({
      where: { id },
      data: { title, content },
    });

    if (!post) throw new ServiceError('Not found');

    return post;
  },
};

/** @type Commands['deletePost'] */
const deletePost = {
  input: deletePostInputSchema,
  handler: async (infra, { data: { id } }) => {
    const { db } = infra;

    const exists = await db.post.delete({ where: { id } }).catch(() => false);
    if (!exists) throw new ServiceError('Not found');
  },
};

/** @type Commands['getPost'] */
const getPost = {
  input: getPostInputSchema,
  output: getPostOutputSchema,
  handler: async (infra, { data: { id } }) => {
    const { db } = infra;

    const post = await db.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post) throw new ServiceError('Not found');

    return post;
  },
};

/** @type Commands['listPosts'] */
const listPosts = {
  input: listPostsInputSchema,
  output: listPostsOutputSchema,
  handler: async (infra, { data: { cursor, limit } }) => {
    const posts = await infra.db.post.findMany({
      take: +limit,
      skip: cursor ? 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });

    return {
      posts,
      nextCursor: posts[posts.length - 1]?.id || null,
    };
  },
};

/** @type Commands */
export const commands = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  listPosts,
};
