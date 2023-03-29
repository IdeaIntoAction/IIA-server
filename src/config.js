/** @typedef {import('./types').Config} Config */
import nodeConfig from 'config';

/** @type Config */
export default {
  env: nodeConfig.get('base.nodeEnv'),
  infra: nodeConfig.get('infra'),
  services: nodeConfig.get('services'),
  server: nodeConfig.get('server'),
};
