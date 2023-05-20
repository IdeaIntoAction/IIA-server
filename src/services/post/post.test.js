import { before, beforeEach, after, afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { init as initInfra, teardown as teardownInfra } from '../../infra/infra.js';
import * as post from './post.js';
import { ServiceError } from '../error.js';

describe('posts', () => {
  let infra;
  let testUser;

  before(async () => {
    infra = await initInfra({
      logger: { env: 'test' },
      db: {},
      bus: { type: 'local' },
      redis: {},
    });

    testUser = await infra.db.user.create({
      data: {
        email: `test${Math.random()}@mail.com`,
        passwordHash: '123',
      },
    });
  });

  beforeEach(async () => {
    const { db } = infra;
    await db.post.deleteMany({});
  });

  afterEach(async () => {
    const { db } = infra;
    await db.post.deleteMany({});
  });

  after(async () => {
    const { db } = infra;
    await db.user.delete({
      where: {
        id: testUser.id,
      },
    });
    await teardownInfra(infra);
  });

  describe('create post', () => {
    it('should create a post', async () => {
      const title = 'Test post title';
      const content = 'Test post content';

      const createdPost = await post.commands.createPost.handler(infra, {
        meta: { userId: testUser.id },
        data: { title, content },
      });

      assert.ok(createdPost.id);
      assert.equal(createdPost.title, title);
      assert.equal(createdPost.content, content);
    });
  });

  describe('update post', () => {
    it('should update a post', async () => {
      const updatedTitle = 'Updated post title';
      const updatedContent = 'Updated post content';

      const testPost = await infra.db.post.create({
        data: {
          title: 'Test post',
          content: 'Test post content',
          author: {
            connect: {
              id: testUser.id,
            },
          },
        },
      });

      const updatedPost = await post.commands.updatePost.handler(infra, {
        data: {
          id: testPost.id,
          title: updatedTitle,
          content: updatedContent,
        },
        meta: { userId: testUser.id },
      });

      assert.equal(updatedPost.id, testPost.id);
      assert.equal(updatedPost.title, updatedTitle);
      assert.equal(updatedPost.content, updatedContent);
    });
  });

  describe('delete post', () => {
    it('Should delete post if exists', async () => {
      const testPost = await infra.db.post.create({
        data: {
          title: 'Test post',
          content: 'Test post content',
          author: {
            connect: {
              id: testUser.id,
            },
          },
        },
      });

      const deletedPost = await post.commands.deletePost.handler(infra, {
        data: { id: testPost.id },
        meta: {},
      });

      assert.notEqual(deletedPost, false);
    });

    it('Should throw error if post does not exist', async () => {
      await infra.db.post.create({
        data: {
          title: 'Test post',
          content: 'Test post content',
          author: {
            connect: {
              id: testUser.id,
            },
          },
        },
      });

      await assert.rejects(
        post.commands.deletePost.handler(infra, {
          data: { id: 0 },
          meta: {},
        }),
        ServiceError,
      );
    });
  });

  describe('get post by id', () => {
    it('Should return post if exists', async () => {
      const testPost = await infra.db.post.create({
        data: {
          title: 'Test post',
          content: 'Test post content',
          author: {
            connect: {
              id: testUser.id,
            },
          },
        },
      });

      const result = await post.commands.getPost.handler(infra, {
        data: { id: testPost.id },
        meta: {},
      });

      assert.equal(result.id, testPost.id);
      assert.equal(result.title, testPost.title);
      assert.equal(result.content, testPost.content);
    });

    it('Should throw error if post does not exist', async () => {
      await infra.db.post.create({
        data: {
          title: 'Test post',
          content: 'Test post content',
          author: {
            connect: {
              id: testUser.id,
            },
          },
        },
      });

      await assert.rejects(
        post.commands.getPost.handler(infra, {
          data: { id: 0 },
          meta: {},
        }),
        ServiceError,
      );
    });
  });

  describe('list posts', () => {
    beforeEach(async () => {
      await infra.db.post.deleteMany({});
    });

    it('should return posts', async () => {
      const testPost1 = await infra.db.post.create({
        data: {
          title: 'Test post 1',
          content: 'Test post content 1',
          author: { connect: { id: testUser.id } },
        },
      });
      await infra.db.post.create({
        data: {
          title: 'Test post 2',
          content: 'Test post content 2',
          author: { connect: { id: testUser.id } },
        },
      });

      const result = await post.commands.listPosts.handler(infra, {
        data: { cursor: 0, limit: 2 },
        meta: {},
      });

      assert.strictEqual(result.posts.length, 2);
      assert.strictEqual(result.nextCursor, testPost1.id); // As the posts are ordered by 'desc' order.
    });

    it('should return nextCursor correctly', async () => {
      const testPost1 = await infra.db.post.create({
        data: {
          title: 'Test post 1',
          content: 'Test post content 1',
          author: { connect: { id: testUser.id } },
        },
      });
      const testPost2 = await infra.db.post.create({
        data: {
          title: 'Test post 2',
          content: 'Test post content 2',
          author: { connect: { id: testUser.id } },
        },
      });

      const result = await post.commands.listPosts.handler(infra, {
        data: { cursor: testPost2.id, limit: 1 },
        meta: {},
      });

      assert.strictEqual(result.posts.length, 1);
      assert.strictEqual(result.nextCursor, testPost1.id);
    });

    it('should return an empty list if no posts', async () => {
      const result = await post.commands.listPosts.handler(infra, {
        data: { cursor: 0, limit: 2 },
        meta: {},
      });

      assert.strictEqual(result.posts.length, 0);
      assert.strictEqual(result.nextCursor, null);
    });
  });
});
