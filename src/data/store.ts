import { configureStore as configureReduxStore } from '@reduxjs/toolkit';
import { devToolsEnhancer } from '@redux-devtools/remote';
import page from './page';
import player from './player';
import settings from './settings';

// Typescript auto return type inferrance gives stronger types.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const configureStore = (name: string) =>
  configureReduxStore({
    reducer: { player, page, settings },
    devTools: false,
    enhancers: [
      devToolsEnhancer({
        name,
        hostname: 'localhost',
        port: 8000,
      }),
    ],
  });

export type Store = ReturnType<typeof configureStore>;
export type RootState = ReturnType<Store['getState']>;
export type Dispatch = Store['dispatch'];
