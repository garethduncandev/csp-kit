import { configExists } from '../config/config-exists.js';
import { defaultConfig } from '../config/default-config.js';
import { exportDefaultConfig } from '../config/export-default-config.js';
import { getConfig } from '../config/get-config.js';
import {
  logDebug,
  logError,
  logInfo,
  logWarn,
  setLogLevel,
} from '../logger.js';
import { main } from '../main.js';
import { CliParameters } from './cli-paramaters.js';

export async function cliHandleAction(
  cliParameters: CliParameters
): Promise<void> {
  logDebug('CLI Parameters:', cliParameters);

  if (cliParameters.config) {
    validateCliParameterConfigPath(cliParameters.config);
  }

  // if no config param provided, use default config path
  // this default config path doesnt have to exist
  const configPath = cliParameters.config ?? '.csprc';

  const configFileExists = configExists(configPath);

  const config = configFileExists ? getConfig(configPath) : defaultConfig();
  config.options.logLevel = cliParameters.logLevel ?? config.options.logLevel;

  config.options.ci = cliParameters.ci ?? config.options.ci;

  setLogLevel(config.options.logLevel, config.options.ci);

  if (configFileExists) {
    logDebug('Config file exists:', configPath);
  } else {
    logDebug('Config file does not exist, using default config:', configPath);
  }

  const createEmptyConfig = cliParameters.createEmptyConfig ?? false;
  if (createEmptyConfig) {
    logInfo('Creating empty config file at:', config.options.directory);
    exportDefaultConfig(config.options.directory);
    return;
  }

  // update config with cli parameters if provided
  config.options.directory =
    cliParameters.directory ?? config.options.directory;

  config.options.sha = cliParameters.sha ?? config.options.sha;

  config.options.addMetaTag =
    cliParameters.addMetaTag ?? config.options.addMetaTag;

  config.options.addIntegrityAttributes =
    cliParameters.addIntegrityAttributes ??
    config.options.addIntegrityAttributes;

  config.options.exportJsonPath =
    cliParameters.exportJsonPath ?? config.options.exportJsonPath;

  await main(config);
}

function validateCliParameterConfigPath(configPath: string): void {
  const configFileExists = configExists(configPath);
  if (!configFileExists) {
    logError('Configuration file not found at', configPath);
    throw new Error('Configuration file not found at: ' + configPath);
  }
}
