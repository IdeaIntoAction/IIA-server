/** @typedef {import('./types.js').ParserCommands} Commands */
import { ServiceError } from '../error.js';
import {
  parserInputSchema,
  parserOutputSchema,
  updateParserInputSchema,
  deleteParserInputSchema,
  getParserInputSchema,
  getParserOutputSchema,
  listParsersInputSchema,
  listParsersOutputSchema,
} from './schema.js';

/** @type Commands['createParser'] */
const createParser = {
  auth: {},
  input: parserInputSchema,
  output: parserOutputSchema,
  handler: async (infra, { data: { site, code }, meta: { userId } }) => {
    const { db } = infra;

    const author = await db.user.findUnique({ where: { id: userId } });
    const parser = await db.parser.create({
      data: { site, code, author: { connect: { id: author?.id } } },
    });

    return parser;
  },
};

/** @type Commands['updateParser'] */
const updateParser = {
  input: updateParserInputSchema,
  output: parserOutputSchema,
  handler: async (infra, { data: { id, site, code } }) => {
    const { db } = infra;

    const parser = await db.parser.update({
      where: { id },
      data: { site, code },
    });

    if (!parser) throw new ServiceError('Not found');

    return parser;
  },
};

/** @type Commands['deleteParser'] */
const deleteParser = {
  input: deleteParserInputSchema,
  handler: async (infra, { data: { id } }) => {
    const { db } = infra;

    const exists = await db.parser.delete({ where: { id } }).catch(() => false);
    if (!exists) throw new ServiceError('Not found');
  },
};

/** @type Commands['getParser'] */
const getParser = {
  input: getParserInputSchema,
  output: getParserOutputSchema,
  handler: async (infra, { data: { id } }) => {
    const { db } = infra;

    const parser = await db.parser.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!parser) throw new ServiceError('Not found');

    return parser;
  },
};

/** @type Commands['listParsers'] */
const listParsers = {
  input: listParsersInputSchema,
  output: listParsersOutputSchema,
  handler: async (infra, { data: { cursor, limit } }) => {
    const parsers = await infra.db.parser.findMany({
      take: +limit,
      skip: cursor ? 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });

    return {
      parsers,
      nextCursor: parsers[parsers.length - 1]?.id || null,
    };
  },
};

/** @type Commands */
export const commands = {
  createParser,
  updateParser,
  deleteParser,
  getParser,
  listParsers,
};
