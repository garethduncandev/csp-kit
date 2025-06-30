export type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug';

let currentLogLevel: LogLevel = 'info';

export function setLogLevel(level: LogLevel) {
  currentLogLevel = level;
}

function shouldLog(level: LogLevel): boolean {
  const levels: LogLevel[] = ['silent', 'error', 'warn', 'info', 'debug'];
  return levels.indexOf(level) <= levels.indexOf(currentLogLevel);
}

export function logInfo(...args: any[]) {
  if (shouldLog('info')) {
    console.log(...args);
  }
}

export function logWarn(...args: any[]) {
  if (shouldLog('warn')) {
    console.warn(...args);
  }
}

export function logError(...args: any[]) {
  if (shouldLog('error')) {
    console.error(...args);
  }
}

export function logDebug(...args: any[]) {
  if (shouldLog('debug')) {
    console.debug(...args);
  }
}
