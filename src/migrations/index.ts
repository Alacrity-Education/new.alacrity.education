import * as migration_20260830_190619 from './20260830_190619';

export const migrations = [
  {
    up: migration_20260830_190619.up,
    down: migration_20260830_190619.down,
    name: '20260830_190619'
  },
];
