import * as migration_20251210_020736 from './20251210_020736';
import * as migration_20251221_add_custom_website_fields from './20251221_add_custom_website_fields';

export const migrations = [
  {
    up: migration_20251210_020736.up,
    down: migration_20251210_020736.down,
    name: '20251210_020736'
  },
  {
    up: migration_20251221_add_custom_website_fields.up,
    down: migration_20251221_add_custom_website_fields.down,
    name: '20251221_add_custom_website_fields'
  },
];
