import * as migration_20260830_190619 from './20260830_190619';
import * as migration_20260901_212437 from './20260901_212437';
import * as migration_20260903_171537 from './20260903_171537';
import * as migration_20260905_133103_gridblock_cell_media from './20260905_133103_gridblock_cell_media';
import * as migration_20260905_135132 from './20260905_135132';

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
    name: '20260903_171537',
  },
  {
    up: migration_20260905_133103_gridblock_cell_media.up,
    down: migration_20260905_133103_gridblock_cell_media.down,
    name: '20260905_133103_gridblock_cell_media',
  },
  {
    up: migration_20260905_135132.up,
    down: migration_20260905_135132.down,
    name: '20260905_135132'
  },
];
