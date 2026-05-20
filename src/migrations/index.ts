import * as migration_20260520_111042 from './20260520_111042';
import * as migration_20260520_134019 from './20260520_134019';
import * as migration_20260520_135204 from './20260520_135204';

export const migrations = [
  {
    up: migration_20260520_111042.up,
    down: migration_20260520_111042.down,
    name: '20260520_111042',
  },
  {
    up: migration_20260520_134019.up,
    down: migration_20260520_134019.down,
    name: '20260520_134019',
  },
  {
    up: migration_20260520_135204.up,
    down: migration_20260520_135204.down,
    name: '20260520_135204'
  },
];
