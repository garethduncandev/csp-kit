export type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug';

let currentLogLevel: LogLevel = 'info';
let ciMode: boolean = false;

export function setLogLevel(level: LogLevel, ci: boolean) {
  currentLogLevel = level;
  ciMode = ci;
}

function shouldLog(level: LogLevel): boolean {
  // Disable all logs in CI except logCiResult
  if (ciMode) return false;

  const levels: LogLevel[] = ['silent', 'error', 'warn', 'info', 'debug'];
  return levels.indexOf(level) <= levels.indexOf(currentLogLevel);
}

export function logInfo(...args: unknown[]) {
  if (shouldLog('info')) {
    console.log(...args);
  }
}

export function logWarn(...args: unknown[]) {
  if (shouldLog('warn')) {
    console.warn(...args);
  }
}

export function logError(...args: unknown[]) {
  if (shouldLog('error')) {
    console.error(...args);
  }
}

export function logDebug(...args: unknown[]) {
  if (shouldLog('debug')) {
    console.debug(...args);
  }
}

export function logCiResult(message: string) {
  if (ciMode) {
    console.log(message);
  }
}
