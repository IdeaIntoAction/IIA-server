/* eslint-disable */
export default /** @type {const} */ ({
  user: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      email: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      passwordHash: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      udpatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['email', 'firstName', 'lastName', 'passwordHash', 'udpatedAt'],
  },
  session: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      token: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      userId: { type: 'string' },
    },
    required: ['token', 'updatedAt', 'userId'],
  },
  account: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      userId: { type: 'string' },
    },
    required: ['updatedAt', 'userId'],
  },
  accountStatement: {
    type: 'object',
    properties: {
      date: { type: 'string', format: 'date-time' },
      balance: { type: 'number' },
      accountId: { type: 'string' },
    },
    required: ['date', 'balance', 'accountId'],
  },
  ledger: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      type: { type: 'string', enum: ['asset', 'liability', 'revenue', 'expense', 'gain', 'loss'] },
      name: { type: 'string' },
    },
    required: ['type', 'name'],
  },
  ledgerStatement: {
    type: 'object',
    properties: {
      date: { type: 'string', format: 'date-time' },
      balance: { type: 'number' },
      ledgerId: { type: 'string' },
    },
    required: ['balance', 'ledgerId'],
  },
  ledgerTransaction: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      amount: { type: 'number' },
      date: { type: 'string', format: 'date-time' },
      fromId: { type: 'string' },
      toId: { type: 'string' },
    },
    required: ['amount', 'fromId', 'toId'],
  },
  accountTransaction: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      date: { type: 'string', format: 'date-time' },
      amount: { type: 'number' },
      typeInternal: { type: 'string', enum: ['credit', 'debit'] },
      typeExternal: { type: 'string', enum: ['deposit', 'withdrawal', 'bankFee'] },
      ledgerId: { type: 'string' },
      accountId: { type: 'string' },
    },
    required: ['amount', 'typeInternal', 'typeExternal', 'ledgerId', 'accountId'],
  },
});
