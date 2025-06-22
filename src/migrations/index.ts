import * as migration_20250611_184041 from './20250611_184041';
import * as migration_20250613_163649 from './20250613_163649';
import * as migration_20250622_093237 from './20250622_093237';

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
    name: '20250622_093237'
  },
];
