import * as fs from 'fs';
import * as path from 'path';
import { Config } from './config.js';
import { logInfo } from '../utils/logger.js';

export function getConfig(configPath: string): Config {
  // Check if the config file exists
  let config: Config = getDefaultConfig();
  logInfo('config path', configPath);
  if (!fs.existsSync(configPath)) {
    logInfo('.csprc file not found at', configPath);
    throw new Error(
      'Config file not found. Please create a .csprc file in the current directory or specify a valid path.'
    );
  }

  logInfo('.csprc file found');
  const configFile = fs.readFileSync(configPath, 'utf-8');
  try {
    config = JSON.parse(configFile) as Config;
    return config;
  } catch (error) {
    console.error('Error parsing config file:', error);
    throw new Error(
      'Invalid config file format. Please check the .csprc file.'
    );
  }
}

export function exportDefaultConfigFile(directory: string): Config {
  const emptyConfig = getDefaultConfig();
  fs.writeFileSync(
    path.resolve(directory, '.csprc'),
    JSON.stringify(emptyConfig, null, 2)
  );
  logInfo('Created empty config file at .csprc');
  return emptyConfig;
}

export function getDefaultConfig(): Config {
  return {
    options: {
      sha: 'sha256',
      directory: './',
      addMetaTag: false,
      addIntegrityAttributes: false,
      logLevel: 'info',
    },
    directives: {
      'default-src': ["'none'"],
      'script-src': ["'self'"],
      'style-src': ["'self'"],
      'img-src': ["'self'"],
      'font-src': ["'self'"],
    },
  };
}
