import * as migration_20251210_020736 from './20251210_020736';
import * as migration_20251221_add_custom_website_fields from './20251221_add_custom_website_fields';
import * as migration_20251224_add_plan_fields from './20251224_add_plan_fields';
import * as migration_20251224_add_multi_tenant_user_access from './20251224_add_multi_tenant_user_access';

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
  {
    up: migration_20251224_add_plan_fields.up,
    down: migration_20251224_add_plan_fields.down,
    name: '20251224_add_plan_fields'
  },
  {
    up: migration_20251224_add_multi_tenant_user_access.up,
    down: migration_20251224_add_multi_tenant_user_access.down,
    name: '20251224_add_multi_tenant_user_access'
  },
];
