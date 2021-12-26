import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';
import devToolsEnhancer from 'remote-redux-devtools';
import page from './page';
import player from './player';

const options: ConfigureStoreOptions = {
  reducer: { player, page },
  devTools: false,
};

if (process.env.NODE_ENV === 'development') {
  options.enhancers = [
    devToolsEnhancer({
      name: 'aniskip-extension',
      realtime: true,
      hostname: 'localhost',
      port: 8000,
    }),
  ];
}

/**
 * Create store.
 */
export const configuredStore = configureStore(options);

export type Store = typeof configuredStore;
export type RootState = ReturnType<typeof configuredStore.getState>;
export type Dispatch = typeof configuredStore.dispatch;
