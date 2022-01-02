import { createContext, useContext } from 'react';

/**
 * Variant context.
 */
const VariantContext = createContext<string>('');
export const VariantProvider = VariantContext.Provider;

/**
 * Custom hook to return a reference to variant.
 */
export const useVariantRef = (): string => useContext(VariantContext);
