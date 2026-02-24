import * as migration_20260214_135919 from './20260214_135919';
import * as migration_20260219_161936 from './20260219_161936';
import * as migration_20260219_203955 from './20260219_203955';
import * as migration_20260219_213459 from './20260219_213459';
import * as migration_20260224_130459 from './20260224_130459';

export const migrations = [
  {
    up: migration_20260214_135919.up,
    down: migration_20260214_135919.down,
    name: '20260214_135919',
  },
  {
    up: migration_20260219_161936.up,
    down: migration_20260219_161936.down,
    name: '20260219_161936',
  },
  {
    up: migration_20260219_203955.up,
    down: migration_20260219_203955.down,
    name: '20260219_203955',
  },
  {
    up: migration_20260219_213459.up,
    down: migration_20260219_213459.down,
    name: '20260219_213459',
  },
  {
    up: migration_20260224_130459.up,
    down: migration_20260224_130459.down,
    name: '20260224_130459'
  },
];
