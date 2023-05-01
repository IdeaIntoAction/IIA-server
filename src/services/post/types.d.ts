import type { Command } from '../types';
import type { Session } from '../../types';
import type { FromSchema } from 'json-schema-to-ts';
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

interface PostCommands {
  createPost: Command<{
    Data: FromSchema<typeof postInputSchema>;
    Meta: Session;
    Returns: FromSchema<typeof postOutputSchema>;
  }>;
  updatePost: Command<{
    Data: FromSchema<typeof updatePostInputSchema>;
    Returns: FromSchema<typeof postOutputSchema>;
  }>;
  deletePost: Command<{
    Data: FromSchema<typeof deletePostInputSchema>;
    Returns: void;
  }>;
  getPost: Command<{
    Data: FromSchema<typeof getPostInputSchema>;
    Returns: FromSchema<typeof getPostOutputSchema>;
  }>;
  listPosts: Command<{
    Data: FromSchema<typeof listPostsInputSchema>;
    Returns: FromSchema<typeof listPostsOutputSchema>;
  }>;
}
