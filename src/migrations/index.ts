import * as migration_20250611_184041 from './20250611_184041';
import * as migration_20250613_163649 from './20250613_163649';
import * as migration_20250622_093237 from './20250622_093237';
import * as migration_20250624_191218 from './20250624_191218';
import * as migration_20250624_194251 from './20250624_194251';
import * as migration_20250624_195542 from './20250624_195542';
import * as migration_20250624_195616 from './20250624_195616';
import * as migration_20250624_195731 from './20250624_195731';

export const migrations = [
  {
    up: migration_20250611_184041.up,
    down: migration_20250611_184041.down,
    name: '20250611_184041',
  },
  {
    up: migration_20250613_163649.up,
    down: migration_20250613_163649.down,
    name: '20250613_163649',
  },
  {
    up: migration_20250622_093237.up,
    down: migration_20250622_093237.down,
    name: '20250622_093237',
  },
  {
    up: migration_20250624_191218.up,
    down: migration_20250624_191218.down,
    name: '20250624_191218',
  },
  {
    up: migration_20250624_194251.up,
    down: migration_20250624_194251.down,
    name: '20250624_194251',
  },
  {
    up: migration_20250624_195542.up,
    down: migration_20250624_195542.down,
    name: '20250624_195542',
  },
  {
    up: migration_20250624_195616.up,
    down: migration_20250624_195616.down,
    name: '20250624_195616',
  },
  {
    up: migration_20250624_195731.up,
    down: migration_20250624_195731.down,
    name: '20250624_195731'
  },
];
