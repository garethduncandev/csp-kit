import fs from 'fs';
import path from 'path';
import { logError } from '../logger.js';
import { Config } from './config.js';

export function getConfig(configPath: string): Config {
  try {
    const configFile = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configFile) as Config;
    // Resolve directory relative to config file if needed
    if (
      config.options &&
      config.options.directory &&
      !path.isAbsolute(config.options.directory)
    ) {
      const configDir = path.dirname(configPath);
      config.options.directory = path.resolve(
        configDir,
        config.options.directory
      );
    }
    return config;
  } catch (error) {
    logError('Error parsing config file', error);
    throw new Error('Invalid config file format');
  }
}
