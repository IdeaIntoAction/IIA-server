import { before, beforeEach, after, afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { init as initInfra, teardown as teardownInfra } from '../../infra/infra.js';
import * as parser from './parser.js';
import { ServiceError } from '../error.js';

describe('parsers', () => {
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
    await db.parser.deleteMany({});
  });

  afterEach(async () => {
    const { db } = infra;
    await db.parser.deleteMany({});
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

  describe('create parser', () => {
    it('should create a parser', async () => {
      const site = 'Test parser title';
      const code = 'Test parser content';

      const createdParser = await parser.commands.createParser.handler(infra, {
        meta: { userId: testUser.id },
        data: { site, code },
      });

      assert.ok(createdParser.id);
      assert.equal(createdParser.site, site);
      assert.equal(createdParser.code, code);
    });
  });

  describe('update parser', () => {
    it('should update a parser', async () => {
      const updatedTitle = 'Updated parser title';
      const updatedContent = 'Updated parser content';

      const testParser = await infra.db.parser.create({
        data: {
          site: 'Test parser',
          code: 'Test parser content',
          author: {
            connect: {
              id: testUser.id,
            },
          },
        },
      });

      const updatedParser = await parser.commands.updateParser.handler(infra, {
        data: {
          id: testParser.id,
          site: updatedTitle,
          code: updatedContent,
        },
        meta: { userId: testUser.id },
      });

      assert.equal(updatedParser.id, testParser.id);
      assert.equal(updatedParser.site, updatedTitle);
      assert.equal(updatedParser.code, updatedContent);
    });
  });

  describe('delete parser', () => {
    it('Should delete parser if exists', async () => {
      const testParser = await infra.db.parser.create({
        data: {
          site: 'Test parser',
          code: 'Test parser content',
          author: {
            connect: {
              id: testUser.id,
            },
          },
        },
      });

      const deletedParser = await parser.commands.deleteParser.handler(infra, {
        data: { id: testParser.id },
        meta: {},
      });

      assert.notEqual(deletedParser, false);
    });

    it('Should throw error if parser does not exist', async () => {
      await infra.db.parser.create({
        data: {
          site: 'Test parser',
          code: 'Test parser content',
          author: {
            connect: {
              id: testUser.id,
            },
          },
        },
      });

      await assert.rejects(
        parser.commands.deleteParser.handler(infra, {
          data: { id: 0 },
          meta: {},
        }),
        ServiceError,
      );
    });
  });

  describe('get parser by id', () => {
    it('Should return parser if exists', async () => {
      const testParser = await infra.db.parser.create({
        data: {
          site: 'Test parser',
          code: 'Test parser content',
          author: {
            connect: {
              id: testUser.id,
            },
          },
        },
      });

      const result = await parser.commands.getParser.handler(infra, {
        data: { id: testParser.id },
        meta: {},
      });

      assert.equal(result.id, testParser.id);
      assert.equal(result.site, testParser.site);
      assert.equal(result.code, testParser.code);
    });

    it('Should throw error if parser does not exist', async () => {
      await infra.db.parser.create({
        data: {
          site: 'Test parser',
          code: 'Test parser content',
          author: {
            connect: {
              id: testUser.id,
            },
          },
        },
      });

      await assert.rejects(
        parser.commands.getParser.handler(infra, {
          data: { id: 0 },
          meta: {},
        }),
        ServiceError,
      );
    });
  });

  describe('list parsers', () => {
    beforeEach(async () => {
      await infra.db.parser.deleteMany({});
    });

    it('should return parsers', async () => {
      const testParser1 = await infra.db.parser.create({
        data: {
          site: 'Test parser 1',
          code: 'Test parser content 1',
          author: { connect: { id: testUser.id } },
        },
      });
      await infra.db.parser.create({
        data: {
          site: 'Test parser 2',
          code: 'Test parser content 2',
          author: { connect: { id: testUser.id } },
        },
      });

      const result = await parser.commands.listParsers.handler(infra, {
        data: { cursor: 0, limit: 2 },
        meta: {},
      });

      assert.strictEqual(result.parsers.length, 2);
      assert.strictEqual(result.nextCursor, testParser1.id); // As the parsers are ordered by 'desc' order.
    });

    it('should return nextCursor correctly', async () => {
      const testParser1 = await infra.db.parser.create({
        data: {
          site: 'Test parser 1',
          code: 'Test parser content 1',
          author: { connect: { id: testUser.id } },
        },
      });
      const testParser2 = await infra.db.parser.create({
        data: {
          site: 'Test parser 2',
          code: 'Test parser content 2',
          author: { connect: { id: testUser.id } },
        },
      });

      const result = await parser.commands.listParsers.handler(infra, {
        data: { cursor: testParser2.id, limit: 1 },
        meta: {},
      });

      assert.strictEqual(result.parsers.length, 1);
      assert.strictEqual(result.nextCursor, testParser1.id);
    });

    it('should return an empty list if no parsers', async () => {
      const result = await parser.commands.listParsers.handler(infra, {
        data: { cursor: 0, limit: 2 },
        meta: {},
      });

      assert.strictEqual(result.parsers.length, 0);
      assert.strictEqual(result.nextCursor, null);
    });
  });
});
