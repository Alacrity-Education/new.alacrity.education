import * as migration_20260830_190619 from './20260830_190619';
import * as migration_20260901_212437 from './20260901_212437';
import * as migration_20260903_171537 from './20260903_171537';
import * as migration_20260905_133103_gridblock_cell_media from './20260905_133103_gridblock_cell_media';
import * as migration_20260905_135132 from './20260905_135132';
import * as migration_20260905_144506 from './20260905_144506';
import * as migration_20260905_152419_cardblock_variants from './20260905_152419_cardblock_variants';
import * as migration_20260905_155357_bigcard_fields from './20260905_155357_bigcard_fields';
import * as migration_20260906_101810_bigcard_background_type from './20260906_101810_bigcard_background_type';
import * as migration_20260906_111250_mediablock_disable_caption from './20260906_111250_mediablock_disable_caption';
import * as migration_20260906_120550 from './20260906_120550';

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
    name: '20260905_135132',
  },
  {
    up: migration_20260905_144506.up,
    down: migration_20260905_144506.down,
    name: '20260905_144506',
  },
  {
    up: migration_20260905_152419_cardblock_variants.up,
    down: migration_20260905_152419_cardblock_variants.down,
    name: '20260905_152419_cardblock_variants',
  },
  {
    up: migration_20260905_155357_bigcard_fields.up,
    down: migration_20260905_155357_bigcard_fields.down,
    name: '20260905_155357_bigcard_fields',
  },
  {
    up: migration_20260906_101810_bigcard_background_type.up,
    down: migration_20260906_101810_bigcard_background_type.down,
    name: '20260906_101810_bigcard_background_type',
  },
  {
    up: migration_20260906_111250_mediablock_disable_caption.up,
    down: migration_20260906_111250_mediablock_disable_caption.down,
    name: '20260906_111250_mediablock_disable_caption',
  },
  {
    up: migration_20260906_120550.up,
    down: migration_20260906_120550.down,
    name: '20260906_120550'
  },
];
