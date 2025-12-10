import * as migration_20251210_020736 from './20251210_020736';

export const migrations = [
  {
    up: migration_20251210_020736.up,
    down: migration_20251210_020736.down,
    name: '20251210_020736'
  },
];
