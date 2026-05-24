import * as migration_20260520_111042 from './20260520_111042';
import * as migration_20260520_134019 from './20260520_134019';
import * as migration_20260520_135204 from './20260520_135204';
import * as migration_20260521_101807 from './20260521_101807';
import * as migration_20260524_102432 from './20260524_102432';

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
    name: '20260520_135204',
  },
  {
    up: migration_20260521_101807.up,
    down: migration_20260521_101807.down,
    name: '20260521_101807',
  },
  {
    up: migration_20260524_102432.up,
    down: migration_20260524_102432.down,
    name: '20260524_102432'
  },
];
