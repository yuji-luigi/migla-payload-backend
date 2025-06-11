import * as migration_20250611_184041 from './20250611_184041';

export const migrations = [
  {
    up: migration_20250611_184041.up,
    down: migration_20250611_184041.down,
    name: '20250611_184041'
  },
];
