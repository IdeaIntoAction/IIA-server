/* eslint-disable */
export default /** @type {const} */ ({
  user: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      email: { type: 'string' },
      passwordHash: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['email', 'passwordHash', 'updatedAt'],
  },
  post: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      authorId: { type: 'integer' },
      title: { type: 'string' },
      coverImage: { type: 'string' },
      content: { type: 'string' },
      isPublished: { type: 'boolean', default: false },
      publishedAt: { type: 'string', format: 'date-time' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['authorId', 'title', 'coverImage', 'content', 'updatedAt'],
  },
  tag: {
    type: 'object',
    properties: { id: { type: 'integer' }, name: { type: 'string' } },
    required: ['name'],
  },
  category: {
    type: 'object',
    properties: { id: { type: 'integer' }, name: { type: 'string' } },
    required: ['name'],
  },
  role: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      description: { type: 'string' },
    },
    required: ['name'],
  },
  userRole: {
    type: 'object',
    properties: { userId: { type: 'integer' }, roleId: { type: 'integer' } },
    required: ['userId', 'roleId'],
  },
  tagOnPost: {
    type: 'object',
    properties: { postId: { type: 'integer' }, tagId: { type: 'integer' } },
    required: ['postId', 'tagId'],
  },
  categoryOnPost: {
    type: 'object',
    properties: { postId: { type: 'integer' }, categoryId: { type: 'integer' } },
    required: ['postId', 'categoryId'],
  },
  session: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      token: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      userId: { type: 'integer' },
    },
    required: ['token', 'updatedAt', 'userId'],
  },
});
