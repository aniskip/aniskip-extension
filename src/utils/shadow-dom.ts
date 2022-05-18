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

/**
 * Adapted from https://github.com/tailwindlabs/headlessui/discussions/874#discussioncomment-1894010
 *
 * Fixes headless UI modal issues.
 *
 * @param shadowRootContainer The HTML element that is the shadowRoot's parent.
 * @param portalRoot The HTML element that you want Modals to be teleported to.
 */
export const patchShadowRoot = (
  shadowRootContainer: HTMLElement,
  portalRoot?: HTMLElement
): void => {
  const element = portalRoot ?? shadowRootContainer.shadowRoot?.children[0];
  if (!element) return;

  const activeElementDescriptorGetter = Object.getOwnPropertyDescriptor(
    Document.prototype,
    'activeElement'
  )?.get;

  Object.defineProperty(Document.prototype, 'activeElement', {
    get() {
      const activeElement = activeElementDescriptorGetter?.call(this);
      if (activeElement === shadowRootContainer) {
        return shadowRootContainer.shadowRoot?.activeElement;
      }

      return activeElement;
    },
  });

  const targetGetter = Object.getOwnPropertyDescriptor(
    Event.prototype,
    'target'
  )?.get;

  Object.defineProperty(Event.prototype, 'target', {
    get(): any {
      const target = targetGetter?.call(this);
      if (target === shadowRootContainer) {
        return this.path[0];
      }
      return target;
    },
  });
};
