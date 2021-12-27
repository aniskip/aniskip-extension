import { createContext, useContext } from 'react';
import { Page } from '../pages/base-page.types';

/**
 * Page context.
 */
const PageContext = createContext<Page | null>(null);
export const PageProvider = PageContext.Provider;

/**
 * Custom hook to return a reference to the page.
 */
export const usePageRef = (): Page | null => useContext(PageContext);
