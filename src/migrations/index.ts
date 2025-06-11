import * as migration_20250611_183010 from './20250611_183010';

export const migrations = [
  {
    up: migration_20250611_183010.up,
    down: migration_20250611_183010.down,
    name: '20250611_183010'
  },
];
