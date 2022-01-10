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
    /**
     * Adds the proxy window script to the page.
     */
    const addProxyScript = (): HTMLScriptElement => {
      const script = document.createElement('script');
      script.textContent = `
        const { currentScript } = document;

        if (document.readyState === 'complete') {
          currentScript.setAttribute('${property}', JSON.stringify(window.${property}));
        } else {
          const listener = () => {
            currentScript.setAttribute('${property}', JSON.stringify(window.${property}));

            window.removeEventListener('load', listener);
          };

          window.addEventListener('load', listener);
        }
      `;

      document.head.appendChild(script);

      return script;
    };

    return new Promise((resolve, reject) => {
      if (document.readyState === 'complete') {
        const script = addProxyScript();

        try {
          const value = script.getAttribute(property) ?? '';
          script.remove();

          resolve(JSON.parse(value));
        } catch (error: any) {
          reject(error);
        }
      }

      window.addEventListener('load', () => {
        const script = addProxyScript();

        try {
          const value = script.getAttribute(property) ?? '';
          script.remove();

          resolve(JSON.parse(value));
        } catch (error: any) {
          reject(error);
        }
      });
    });
  }
}
