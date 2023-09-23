import type { Command } from '../types';
import type { Session } from '../../types';
import type { FromSchema } from 'json-schema-to-ts';
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

interface ParserCommands {
  createParser: Command<{
    Data: FromSchema<typeof parserInputSchema>;
    Meta: Session;
    Returns: FromSchema<typeof parserOutputSchema>;
  }>;
  updateParser: Command<{
    Data: FromSchema<typeof updateParserInputSchema>;
    Returns: FromSchema<typeof parserOutputSchema>;
  }>;
  deleteParser: Command<{
    Data: FromSchema<typeof deleteParserInputSchema>;
    Returns: void;
  }>;
  getParser: Command<{
    Data: FromSchema<typeof getParserInputSchema>;
    Returns: FromSchema<typeof getParserOutputSchema>;
  }>;
  listParsers: Command<{
    Data: FromSchema<typeof listParsersInputSchema>;
    Returns: FromSchema<typeof listParsersOutputSchema>;
  }>;
}
