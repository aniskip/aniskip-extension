import { createContext, useContext, useEffect } from 'react';

/**
 * Shadow root context.
 */
const ShadowRootContext = createContext<ShadowRoot | undefined>(undefined);
export const ShadowRootProvider = ShadowRootContext.Provider;

/**
 * Custom hook to return a reference to the shadow root.
 */
export const useShadowRootRef = (): ShadowRoot | undefined =>
  useContext(ShadowRootContext);

/**
 * Adds an event listener to the shadow root.
 *
 * @param shadowRoot Shadow root to add an event listener to.
 * @param type Type of event to listen for.
 * @param listener Event listener.
 * @param options Event listener options.
 */
export const useShadowRootEvent = (
  shadowRoot: ShadowRoot,
  type: string,
  listener: (event: Event) => any,
  options?: boolean | AddEventListenerOptions
): void => {
  useEffect(() => {
    shadowRoot.addEventListener(type, listener, options);

    return (): void => shadowRoot.removeEventListener(type, listener, options);
  }, [listener, options]);
};
