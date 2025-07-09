import { SHA } from '../hashers/sha.js';
import type { LogLevel } from '../logger.js';

export interface Config {
  options: {
    directory: string;
    sha: SHA;
    addMetaTag: boolean;
    addIntegrityAttributes: boolean;
    logLevel: LogLevel;
    ci: boolean;
  };
  directives: {
    [key: string]: string[];
  };
}
