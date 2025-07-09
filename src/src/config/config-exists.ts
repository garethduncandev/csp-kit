import fs from 'fs';

export function configExists(configPath: string): boolean {
  if (fs.existsSync(configPath)) {
    return true;
  }
  return false;
}
