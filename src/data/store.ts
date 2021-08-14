import { configureStore } from '@reduxjs/toolkit';
import player from './player';

/**
 * Create store.
 */
export const configuredStore = configureStore({
  reducer: { player },
});

export type Store = typeof configuredStore;
export type RootState = ReturnType<typeof configuredStore.getState>;
export type Dispatch = typeof configuredStore.dispatch;
