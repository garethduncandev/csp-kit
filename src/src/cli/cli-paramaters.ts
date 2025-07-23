import { SHA } from '../hashers/sha.js';
import { LogLevel } from '../logger.js';

export interface CliParameters {
  config?: string;
  createEmptyConfig?: boolean;
  sha?: SHA;
  directory?: string;
  addMetaTag?: boolean;
  addIntegrityAttributes?: boolean;
  logLevel?: LogLevel;
  ci?: boolean;
  exportJsonPath?: string;
}
