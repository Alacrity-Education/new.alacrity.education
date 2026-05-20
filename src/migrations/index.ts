import * as migration_20260520_111042 from './20260520_111042';

export const migrations = [
  {
    up: migration_20260520_111042.up,
    down: migration_20260520_111042.down,
    name: '20260520_111042'
  },
];
