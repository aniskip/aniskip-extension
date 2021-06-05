import { useState } from 'react';

import isMobileTest from '../utils/responsive_utils';

/**
 * Returns if the browser is a mobile browser
 */
const useMobileState = () => {
  const [isMobile] = useState(isMobileTest());

  return { isMobile };
};

export default useMobileState;
