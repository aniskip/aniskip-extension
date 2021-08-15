import { useDispatch as useTypedDispatch } from 'react-redux';
import { Dispatch } from '../data';

/**
 * Typed useDispatch hook.
 */
export const useDispatch = (): ReturnType<typeof useTypedDispatch> =>
  useTypedDispatch<Dispatch>();
