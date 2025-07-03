#!/usr/bin/env node
import { Command } from 'commander';
import { cliHandleAction } from './cli-handle-action.js';

const program = new Command();

program
  .option('--create-empty-config', 'Create empty config file')
  .option('--sha <string>', 'SHA type - sha256, sha384 or sha512')
  .option('--directory <string>', 'Directory')
  .option('--config <string>', 'CLI config', '.csprc')
  .option('--add-meta-tag', 'Insert csp meta tag into head of html file')
  .option('--ci', 'Continuous Integration mode', false)
  .option(
    '--add-integrity-attributes',
    'Update html script with integrity attributes'
  )
  .option(
    '--log-level <string>',
    'Log level: silent, error, warn, info, debug',
    'info'
  )
  .action(cliHandleAction);

program.parse(process.argv);
