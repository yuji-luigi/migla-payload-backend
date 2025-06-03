import * as migration_20250531_100654_initial from './20250531_100654_initial';
import * as migration_20250601_060011 from './20250601_060011';

export const migrations = [
  {
    up: migration_20250531_100654_initial.up,
    down: migration_20250531_100654_initial.down,
    name: '20250531_100654_initial',
  },
  {
    up: migration_20250601_060011.up,
    down: migration_20250601_060011.down,
    name: '20250601_060011'
  },
];
