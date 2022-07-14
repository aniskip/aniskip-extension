import { createContext, useContext } from 'react';
import { Page } from '../pages/base-page.types';

/**
 * Page context.
 */
const PageContext = createContext<Page | undefined>(undefined);
export const PageProvider = PageContext.Provider;

/**
 * Custom hook to return a reference to the page.
 */
export const usePageRef = (): Page => {
  const page = useContext(PageContext);

  if (!page) {
    throw new Error('Cannot retrieve a reference to the page object');
  }

  return page;
};
