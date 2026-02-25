import * as migration_20260214_135919 from './20260214_135919';
import * as migration_20260219_161936 from './20260219_161936';
import * as migration_20260219_203955 from './20260219_203955';
import * as migration_20260219_213459 from './20260219_213459';
import * as migration_20260224_130459 from './20260224_130459';
import * as migration_20260225_202410 from './20260225_202410';
import * as migration_20260225_211936 from './20260225_211936';
import * as migration_20260225_214559 from './20260225_214559';
import * as migration_20260225_220516 from './20260225_220516';

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
    name: '20260224_130459',
  },
  {
    up: migration_20260225_202410.up,
    down: migration_20260225_202410.down,
    name: '20260225_202410',
  },
  {
    up: migration_20260225_211936.up,
    down: migration_20260225_211936.down,
    name: '20260225_211936',
  },
  {
    up: migration_20260225_214559.up,
    down: migration_20260225_214559.down,
    name: '20260225_214559',
  },
  {
    up: migration_20260225_220516.up,
    down: migration_20260225_220516.down,
    name: '20260225_220516'
  },
];
