import * as migration_20261125_072229_initial from './20261125_072229_initial';
import * as migration_20261126_022652_google_sub from './20261126_022652_google_sub';

export const migrations = [
  {
    up: migration_20261125_072229_initial.up,
    down: migration_20261125_072229_initial.down,
    name: '20261125_072229_initial',
  },
  {
    up: migration_20261126_022652_google_sub.up,
    down: migration_20261126_022652_google_sub.down,
    name: '20261126_022652_google_sub'
  },
];
