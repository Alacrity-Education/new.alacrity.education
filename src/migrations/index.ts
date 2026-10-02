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
import * as migration_20260906_203811_timeline_rebuild from './20260906_203811_timeline_rebuild';
import * as migration_20260906_220917 from './20260906_220917';
import * as migration_20260907_155911 from './20260907_155911';
import * as migration_20260909_081330_drop_use_as_template from './20260909_081330_drop_use_as_template';
import * as migration_20260912_180709_drop_inherits_from from './20260912_180709_drop_inherits_from';
import * as migration_20260929_161156 from './20260929_161156';
import * as migration_20261001_205718_rename_card_variant_add_layout from './20261001_205718_rename_card_variant_add_layout';
import * as migration_20261002_001500_gallery_single_title from './20261002_001500_gallery_single_title';
import * as migration_20261002_013000_card_single_treatment from './20261002_013000_card_single_treatment';
import * as migration_20261002_154500_footer_github from './20261002_154500_footer_github';
import * as migration_20261002_160000_footer_link_url_nullable from './20261002_160000_footer_link_url_nullable';

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
    name: '20260906_120550',
  },
  {
    up: migration_20260906_203811_timeline_rebuild.up,
    down: migration_20260906_203811_timeline_rebuild.down,
    name: '20260906_203811_timeline_rebuild',
  },
  {
    up: migration_20260906_220917.up,
    down: migration_20260906_220917.down,
    name: '20260906_220917',
  },
  {
    up: migration_20260907_155911.up,
    down: migration_20260907_155911.down,
    name: '20260907_155911',
  },
  {
    up: migration_20260909_081330_drop_use_as_template.up,
    down: migration_20260909_081330_drop_use_as_template.down,
    name: '20260909_081330_drop_use_as_template',
  },
  {
    up: migration_20260912_180709_drop_inherits_from.up,
    down: migration_20260912_180709_drop_inherits_from.down,
    name: '20260912_180709_drop_inherits_from',
  },
  {
    up: migration_20260929_161156.up,
    down: migration_20260929_161156.down,
    name: '20260929_161156',
  },
  {
    up: migration_20261001_205718_rename_card_variant_add_layout.up,
    down: migration_20261001_205718_rename_card_variant_add_layout.down,
    name: '20261001_205718_rename_card_variant_add_layout'
  },
  {
    up: migration_20261002_001500_gallery_single_title.up,
    down: migration_20261002_001500_gallery_single_title.down,
    name: '20261002_001500_gallery_single_title'
  },
  {
    up: migration_20261002_013000_card_single_treatment.up,
    down: migration_20261002_013000_card_single_treatment.down,
    name: '20261002_013000_card_single_treatment'
  },
  {
    up: migration_20261002_154500_footer_github.up,
    down: migration_20261002_154500_footer_github.down,
    name: '20261002_154500_footer_github'
  },
  {
    up: migration_20261002_160000_footer_link_url_nullable.up,
    down: migration_20261002_160000_footer_link_url_nullable.down,
    name: '20261002_160000_footer_link_url_nullable'
  },
];
