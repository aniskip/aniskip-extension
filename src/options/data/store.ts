import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';
import settings from './settings';

const options: ConfigureStoreOptions = {
  reducer: { settings },
  devTools: true,
};

/**
 * Create store.
 */
export const configuredStore = configureStore(options);

export type Store = typeof configuredStore;
export type RootState = ReturnType<typeof configuredStore.getState>;
export type Dispatch = typeof configuredStore.dispatch;
