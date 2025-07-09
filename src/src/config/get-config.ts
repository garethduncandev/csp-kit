import fs from 'fs';
import { logError } from '../logger.js';
import { Config } from './config.js';

export function getConfig(configPath: string): Config {
  try {
    const configFile = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configFile) as Config;
    return config;
  } catch (error) {
    logError('Error parsing config file', error);
    throw new Error('Invalid config file format');
  }
}
