import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
    const id = uuidv4();

    /**
     * Adds the proxy window script to the page.
     */
    const addProxyScript = (): HTMLScriptElement => {
      const script = document.createElement('script');
      const scriptContent = document.createTextNode(`
        const { currentScript } = document;

        /**
         * Retrieves the property and sets it as the data attribute.
         */
        const setAttribute = () =>
          currentScript.setAttribute('data-${id}', JSON.stringify(window.${property}));

        /**
         * Main function.
         */
        (() => {
          if (document.readyState === 'complete') {
            setAttribute();

            return;
          }

          const listener = () => {
            setAttribute();

            window.removeEventListener('load', listener);
          };

          window.addEventListener('load', listener);
        })();
      `);

      script.appendChild(scriptContent);
      document.head.appendChild(script);

      return script;
    };

    return new Promise((resolve, reject) => {
      /**
       * Retrieves the data from the script tag.
       */
      const getData = (): void => {
        const script = addProxyScript();

        try {
          const value = script.getAttribute(`data-${id}`) ?? '';
          script.remove();

          resolve(JSON.parse(value));
        } catch (error: any) {
          reject(error);
        }
      };

      if (document.readyState === 'complete') {
        getData();

        return;
      }

      window.addEventListener('load', () => {
        getData();
      });
    });
  }
}
