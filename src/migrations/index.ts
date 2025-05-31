import * as migration_20250531_100654_initial from './20250531_100654_initial';

export const migrations = [
  {
    up: migration_20250531_100654_initial.up,
    down: migration_20250531_100654_initial.down,
    name: '20250531_100654_initial'
  },
];
