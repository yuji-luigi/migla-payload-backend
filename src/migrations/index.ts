import * as migration_20250711_211942 from './20250711_211942';

export const migrations = [
  {
    up: migration_20250711_211942.up,
    down: migration_20250711_211942.down,
    name: '20250711_211942'
  },
];
