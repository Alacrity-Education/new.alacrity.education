import * as migration_20260512_200157 from './20260512_200157';

export const migrations = [
  {
    up: migration_20260512_200157.up,
    down: migration_20260512_200157.down,
    name: '20260512_200157'
  },
];
