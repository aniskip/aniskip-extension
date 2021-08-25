import { useState } from 'react';
import { isMobileCheck } from '../utils';

/**
 * Returns if the browser is a mobile browser.
 */
export const useCheckIsMobile = (): { isMobile: boolean } => {
  const [isMobile] = useState(isMobileCheck());

  return { isMobile };
};
