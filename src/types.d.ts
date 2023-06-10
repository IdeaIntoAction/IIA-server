import { InfraOptions as InfraConfig } from './infra/types';
import { ServicesConfig } from './services/types';
import { ServerConfig } from './server/types';

export interface GoogleCloudConfig {
  bucketName: string;
  projectId: string;
  keyFilename: string;
}

export interface Config {
  env: string;
  infra: InfraConfig;
  services: ServicesConfig;
  server: ServerConfig;
  googleCloud: GoogleCloudConfig;
}

export interface Session {
  userId: number;
}
