import { useEffect } from 'react';

/**
 * Adds an event listener to the window.
 *
 * @param type Type of event to listen for.
 * @param listener Event listener.
 * @param options Event listener options.
 */
export const useWindowEvent = <K extends keyof WindowEventMap>(
  type: K,
  listener: (event: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void => {
  useEffect(() => {
    window.addEventListener(type, listener, options);

    return (): void => window.removeEventListener(type, listener, options);
  }, [listener, options]);
};
