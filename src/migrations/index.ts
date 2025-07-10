import * as migration_20250710_185404 from './20250710_185404';

export const migrations = [
  {
    up: migration_20250710_185404.up,
    down: migration_20250710_185404.down,
    name: '20250710_185404'
  },
];
