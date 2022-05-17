import path from 'path';

export const getRootPath = (...args: string[]): string =>
  path.resolve(__dirname, '..', ...args);
