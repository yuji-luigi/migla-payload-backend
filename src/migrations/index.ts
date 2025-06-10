import * as migration_20250531_100654_initial from './20250531_100654_initial';
import * as migration_20250601_060011 from './20250601_060011';
import * as migration_20250605_201808 from './20250605_201808';
import * as migration_20250607_102913 from './20250607_102913';
import * as migration_20250607_203410 from './20250607_203410';
import * as migration_20250610_155759 from './20250610_155759';

export const migrations = [
  {
    up: migration_20250531_100654_initial.up,
    down: migration_20250531_100654_initial.down,
    name: '20250531_100654_initial',
  },
  {
    up: migration_20250601_060011.up,
    down: migration_20250601_060011.down,
    name: '20250601_060011',
  },
  {
    up: migration_20250605_201808.up,
    down: migration_20250605_201808.down,
    name: '20250605_201808',
  },
  {
    up: migration_20250607_102913.up,
    down: migration_20250607_102913.down,
    name: '20250607_102913',
  },
  {
    up: migration_20250607_203410.up,
    down: migration_20250607_203410.down,
    name: '20250607_203410',
  },
  {
    up: migration_20250610_155759.up,
    down: migration_20250610_155759.down,
    name: '20250610_155759'
  },
];
