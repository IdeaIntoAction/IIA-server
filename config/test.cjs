// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('./base.cjs');
module.exports = {
  ...baseConfig,
  base: {
    nodeEnv: 'test',
  },
};
