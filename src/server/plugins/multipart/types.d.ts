import type { FastifyPluginAsync } from 'fastify';

export interface MultipartPluginOptions {
  limits?: {
    fieldNameSize: number; // Max field name size in bytes
    fieldSize: number; // Max field value size in bytes
    fields: number; // Max number of non-file fields
    fileSize: number; // For multipart forms, the max file size in bytes
    files: number; // Max number of file fields
    headerPairs: number; // Max number of header key=>value pairs
    parts: number;
  };
  addToBody?: boolean;
  attachFieldsToBody?: 'keyValues' | boolean;
  sharedSchemaId?: string;
}

export type MultipartPlugin = FastifyPluginAsync<MultipartPluginOptions>;
