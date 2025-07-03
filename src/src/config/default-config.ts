import { Config } from './config.js';

export function defaultConfig(): Config {
  return {
    options: {
      sha: 'sha256',
      directory: './',
      addMetaTag: false,
      addIntegrityAttributes: false,
      logLevel: 'info',
      ci: false,
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
