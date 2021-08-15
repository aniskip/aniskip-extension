import { configureStore } from '@reduxjs/toolkit';
import devToolsEnhancer from 'remote-redux-devtools';
import player from './player';

/**
 * Create store.
 */
export const configuredStore = configureStore({
  reducer: { player },
  devTools: false,
  enhancers: [
    devToolsEnhancer({
      name: 'aniskip-extension',
      realtime: true,
      hostname: 'localhost',
      port: 8000,
    }),
  ],
});

export type Store = typeof configuredStore;
export type RootState = ReturnType<typeof configuredStore.getState>;
export type Dispatch = typeof configuredStore.dispatch;
