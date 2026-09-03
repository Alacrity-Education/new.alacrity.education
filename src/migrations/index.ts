import * as migration_20260830_190619 from './20260830_190619';
import * as migration_20260901_212437 from './20260901_212437';
import * as migration_20260903_171537 from './20260903_171537';

export const migrations = [
  {
    up: migration_20260830_190619.up,
    down: migration_20260830_190619.down,
    name: '20260830_190619',
  },
  {
    up: migration_20260901_212437.up,
    down: migration_20260901_212437.down,
    name: '20260901_212437',
  },
  {
    up: migration_20260903_171537.up,
    down: migration_20260903_171537.down,
    name: '20260903_171537'
  },
];
