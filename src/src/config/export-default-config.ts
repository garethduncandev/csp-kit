import fs from 'fs';
import path from 'path';
import { logDebug, logInfo } from '../logger.js';
import { Config } from './config.js';
import { defaultConfig } from './default-config.js';

export function exportDefaultConfig(directory: string): Config {
  const emptyConfig = defaultConfig();
  fs.writeFileSync(
    path.resolve(directory, '.csprc'),
    JSON.stringify(emptyConfig, null, 2)
  );
  logDebug('Created empty config file at .csprc');
  return emptyConfig;
}
