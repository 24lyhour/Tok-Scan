import * as migration_20261125_072229_initial from './20261125_072229_initial';
import * as migration_20261126_022652_google_sub from './20261126_022652_google_sub';
import * as migration_20261126_065240_restaurant_onboarding from './20261126_065240_restaurant_onboarding';
import * as migration_20261126_084611_super_admin_console from './20261126_084611_super_admin_console';
import * as migration_20261127_101613_separate_admins_table from './20261127_101613_separate_admins_table';

export const migrations = [
  {
    up: migration_20261125_072229_initial.up,
    down: migration_20261125_072229_initial.down,
    name: '20261125_072229_initial',
  },
  {
    up: migration_20261126_022652_google_sub.up,
    down: migration_20261126_022652_google_sub.down,
    name: '20261126_022652_google_sub',
  },
  {
    up: migration_20261126_065240_restaurant_onboarding.up,
    down: migration_20261126_065240_restaurant_onboarding.down,
    name: '20261126_065240_restaurant_onboarding',
  },
  {
    up: migration_20261126_084611_super_admin_console.up,
    down: migration_20261126_084611_super_admin_console.down,
    name: '20261126_084611_super_admin_console',
  },
  {
    up: migration_20261127_101613_separate_admins_table.up,
    down: migration_20261127_101613_separate_admins_table.down,
    name: '20261127_101613_separate_admins_table'
  },
];
