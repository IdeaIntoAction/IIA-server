import type { MultipartFile } from '@fastify/multipart';
import type { Command } from '../types';
import type { Session } from '../../types';
import type { FromSchema } from 'json-schema-to-ts';

import { imageUploaderOutputSchema } from './schema.js';

interface FileUploaderCommands {
  uploadImage: Command<{
    Data: { image: MultipartFile };
    Meta: Session;
    Returns: FromSchema<typeof imageUploaderOutputSchema>;
  }>;
}
