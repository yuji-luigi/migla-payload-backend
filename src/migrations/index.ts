import * as migration_20250711_211942 from './20250711_211942';
import * as migration_20250712_071914 from './20250712_071914';
import * as migration_20250719_173014 from './20250719_173014';
import * as migration_20250720_060601 from './20250720_060601';

export const migrations = [
  {
    up: migration_20250711_211942.up,
    down: migration_20250711_211942.down,
    name: '20250711_211942',
  },
  {
    up: migration_20250712_071914.up,
    down: migration_20250712_071914.down,
    name: '20250712_071914',
  },
  {
    up: migration_20250719_173014.up,
    down: migration_20250719_173014.down,
    name: '20250719_173014',
  },
  {
    up: migration_20250720_060601.up,
    down: migration_20250720_060601.down,
    name: '20250720_060601'
  },
];
