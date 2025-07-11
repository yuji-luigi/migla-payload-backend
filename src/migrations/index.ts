import * as migration_20250710_185404 from './20250710_185404';
import * as migration_20250711_211419 from './20250711_211419';

export const migrations = [
  {
    up: migration_20250710_185404.up,
    down: migration_20250710_185404.down,
    name: '20250710_185404',
  },
  {
    up: migration_20250711_211419.up,
    down: migration_20250711_211419.down,
    name: '20250711_211419'
  },
];
