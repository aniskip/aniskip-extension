import { useState } from 'react';
import { isMobileTest } from '../utils';

/**
 * Returns if the browser is a mobile browser.
 */
export const useMobileState = (): { isMobile: boolean } => {
  const [isMobile] = useState(isMobileTest());

  return { isMobile };
};
