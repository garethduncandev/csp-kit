import { SHAType } from '../hashers/sha-type.js';
import { LogLevel } from '../utils/logger.js';

export interface CliParameters {
  config: string;
  createEmptyConfig?: boolean;
  sha?: SHAType;
  directory?: string;
  addMetaTag?: boolean;
  addIntegrityAttributes?: boolean;
  logLevel?: LogLevel;
}
