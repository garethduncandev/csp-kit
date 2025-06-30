import { SHAType } from './../hashers/sha-type.js';
import type { LogLevel } from '../utils/logger.js';

export interface Config {
  options: {
    directory: string;
    sha: SHAType;
    addMetaTag: boolean;
    addIntegrityAttributes: boolean;
    logLevel: LogLevel;
  };
  directives: {
    [key: string]: string[];
  };
}
