#!/usr/bin/env node
import * as commander from 'commander';
import { exportDefaultConfigFile, getConfig } from '../config/config-utils.js';
import { main } from '../main.js';
import { CliParameters } from './cli-paramaters.js';

const program = new commander.Command();

program
  .option('--create-empty-config', 'Create empty config file')
  .option('--sha <string>', 'SHA type - sha256, sha384 or sha512')
  .option('--directory <string>', 'Directory')
  .option('--config <string>', 'CLI config', '.csprc')
  .option('--add-meta-tag', 'Insert csp meta tag into head of html file')
  .option(
    '--add-integrity-attributes',
    'Update html script with integrity attributes'
  )
  .option(
    '--log-level <string>',
    'Log level: silent, error, warn, info, debug',
    'info'
  )
  .action(async (cliParameters: CliParameters) => {
    console.log(cliParameters);
    // load config from path or fallback to default config
    const config = getConfig(cliParameters.config);

    // update config with cli parameters if provided
    config.options.directory =
      cliParameters.directory ?? config.options.directory;
    config.options.sha = cliParameters.sha ?? config.options.sha;
    config.options.addMetaTag =
      cliParameters.addMetaTag ?? config.options.addMetaTag;
    config.options.addIntegrityAttributes =
      cliParameters.addIntegrityAttributes ??
      config.options.addIntegrityAttributes;
    config.options.logLevel = cliParameters.logLevel ?? config.options.logLevel;

    const createEmptyConfig = cliParameters.createEmptyConfig ?? false;
    if (createEmptyConfig) {
      exportDefaultConfigFile(config.options.directory);
      return;
    }

    await main(config);
  });

program.parse(process.argv);
