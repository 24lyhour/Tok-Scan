import * as migration_20261125_072229_initial from './20261125_072229_initial'

export const migrations = [
     {
          up: migration_20261125_072229_initial.up,
          down: migration_20261125_072229_initial.down,
          name: '20261125_072229_initial',
     },
]
