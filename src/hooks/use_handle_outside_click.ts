import React, { useEffect } from 'react';

/**
 * Detects clicks outside the reference element
 * @param reference Reference to the HTML element
 * @param callback Callback to call after an outside click occurrs
 */
const useHandleOutsideClick = <T extends HTMLElement>(
  reference: React.RefObject<T>,
  callback: CallableFunction
) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdownClicked = !!reference.current?.contains(target);
      if (!dropdownClicked) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [callback, reference]);
};

export default useHandleOutsideClick;
