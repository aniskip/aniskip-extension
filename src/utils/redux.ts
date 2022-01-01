import {
  useDispatch as useTypedDispatch,
  useSelector as useTypedSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import { Dispatch, RootState } from '../data';

/**
 * Typed useDispatch hook.
 */
export const useDispatch = (): ReturnType<typeof useTypedDispatch> =>
  useTypedDispatch<Dispatch>();

/**
 * Typed useSelector hook.
 */
export const useSelector: TypedUseSelectorHook<RootState> = useTypedSelector;
