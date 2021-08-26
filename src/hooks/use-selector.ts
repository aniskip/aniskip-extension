import {
  TypedUseSelectorHook,
  useSelector as useTypedSelector,
} from 'react-redux';
import { RootState } from '../data';

/**
 * Typed useSelector hook.
 */
export const useSelector: TypedUseSelectorHook<RootState> = useTypedSelector;
