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
  parser: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      authorId: { type: 'integer' },
      site: { type: 'string' },
      code: { type: 'string' },
      publishedAt: { type: 'string', format: 'date-time' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['authorId', 'site', 'code', 'updatedAt'],
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
