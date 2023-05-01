import { before, beforeEach, after, afterEach, describe, it } from 'node:test';
import assert from 'node:assert';
import { init as initInfra, teardown as teardownInfra } from '../../infra/infra.js';
import * as post from './post.js';

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

      assert(createdPost.id);
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
});
