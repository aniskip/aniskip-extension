import { useEffect } from 'react';
import { browser } from 'webextension-polyfill-ts';

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

/**
 * Proxy to the global window object.
 */
export class WindowProxy {
  /**
   * Returns the property from the global window object.
   *
   * @param property Property to retrieve from proxy window.
   */
  getProperty<T = any>(property: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.src = browser.runtime.getURL('scripts/window-proxy/script.js');
      script.dataset.property = property;

      (document.head || document.documentElement).appendChild(script);

      new MutationObserver((_mutations, observer) => {
        const { value } = script.dataset;

        if (!value) {
          return;
        }

        observer.disconnect();

        try {
          resolve(JSON.parse(value));
        } catch (error: any) {
          reject(error);
        }

        script.remove();
      }).observe(script, { attributes: true });
    });
  }
}
