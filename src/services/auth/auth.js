/** @typedef {import('./types').AuthCommands} Commands */
import * as crypto from '../../lib/crypto.js';
import { AppError } from '../../lib/error.js';
import {
  signUpInput,
  signUpOutput,
  signInInput,
  signInOutput,
  signOutInput,
  refreshInput,
  refreshOutput,
  verifyInput,
  verifyOutput,
} from './schema.js';

/** @type Commands['signUp']  */
const signUp = {
  input: signUpInput,
  output: signUpOutput,
  handler: async (infra, { data: { email, password, ...rest } }) => {
    const { db, bus } = infra;

    const exists = await db.user.findUnique({ where: { email } });
    if (exists) throw new AppError('Already exists');

    const passwordHash = await crypto.hash(password);

    const { id: userId } = await db.user.create({
      data: { email, passwordHash, ...rest },
    });

    const token = crypto.random();
    await db.session.create({ data: { userId, token } });

    bus.publish('auth.signUp', { meta: {}, data: { email } });

    return { userId, token };
  },
};

/** @type Commands['signIn']  */
const signIn = {
  input: signInOutput,
  output: signInOutput,
  handler: async (infra, { data: { email, password } }) => {
    const { db } = infra;

    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Invalid credentials');

    const valid = await crypto.compare(password, user.passwordHash);
    if (!valid) throw new AppError('Invalid credentials');

    const { id: userId } = user;
    const token = crypto.random();
    await db.session.create({ data: { userId, token } });

    return { userId, token };
  },
};

/** @type Commands['signOut']  */
const signOut = {
  input: signOutInput,
  handler: async (infra, { data: { token } }) => {
    const { db } = infra;

    const exists = await db.session
      .delete({ where: { token } })
      .catch(() => false);
    if (!exists) throw new AppError('Not found');
  },
};

/** @type Commands['refresh']  */
const refresh = {
  input: refreshInput,
  output: refreshOutput,
  handler: async (infra, { data: { token } }) => {
    const { db } = infra;

    const session = await db.session.findUnique({ where: { token } });
    if (!session) throw new AppError('Not found');

    const newToken = crypto.random();
    await db.session.update({
      where: { id: session.id },
      data: { token: newToken },
    });

    return { token: newToken };
  },
};

/** @type Commands['verify']  */
const verify = {
  input: verifyInput,
  output: verifyOutput,
  handler: async (infra, { data: { token } }) => {
    const { db } = infra;

    const session = await db.session.findUnique({ where: { token } });
    if (!session) throw new AppError('Not found');

    return { userId: session.userId };
  },
};

/** @type Commands */
export const commands = {
  signUp,
  signIn,
  signOut,
  refresh,
  verify,
};
