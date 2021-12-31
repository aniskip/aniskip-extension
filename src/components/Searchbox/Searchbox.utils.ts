import { createContext, useContext } from 'react';
import { Actions } from './Searchbox.data';
import { SearchboxState } from './Searchbox.types';

/**
 * Searchbox state and dispatch context.
 */
const SearchboxContext = createContext<
  [SearchboxState, React.Dispatch<Actions>] | undefined
>(undefined);
export const SearchboxProvider = SearchboxContext.Provider;

/**
 * Custom hook to return a reference to the Searchbox state and dispatch.
 */
export const useSearchboxRef = ():
  | [SearchboxState, React.Dispatch<Actions>]
  | undefined => useContext(SearchboxContext);
