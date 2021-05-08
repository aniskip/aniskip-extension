import { browser } from 'webextension-polyfill-ts';

import Renderer from '../types/renderer_type';

abstract class BaseRenderer implements Renderer {
  id: string;

  reactRootId: string;

  shadowRoot: ShadowRoot;

  shadowRootContainer: HTMLDivElement;

  constructor(id: string, stopPropagationEvents: string[] = []) {
    this.id = id;
    this.reactRootId = `${id}-root`;
    this.shadowRootContainer = document.createElement('div');
    this.shadowRootContainer.setAttribute('id', this.id);
    this.shadowRoot = this.createShadowRoot(
      this.shadowRootContainer,
      stopPropagationEvents
    );
  }

  abstract render(): void;

  /**
   * Creates a shadow root initialised with the tailwindcss stylesheet
   *
   * @param container Container element to add shadow root to
   * @param stopPropagationEvents Events to stop propagation of
   */
  createShadowRoot(
    container: HTMLDivElement,
    stopPropagationEvents: string[] = []
  ) {
    const shadowRoot = container.attachShadow({
      mode: 'open',
    });

    stopPropagationEvents.forEach((eventName) => {
      container.addEventListener(eventName, (event) => {
        event.stopPropagation();
      });
    });

    (async () => {
      const cssUrl = browser.runtime.getURL('player_script.css');
      const response = await fetch(cssUrl, { method: 'GET' });
      const cssString = await response.text();
      const style = document.createElement('style');
      style.innerHTML = cssString;
      shadowRoot.appendChild(style);

      const reactRoot = document.createElement('div');
      reactRoot.setAttribute('id', this.reactRootId);
      shadowRoot.appendChild(reactRoot);
    })();

    return shadowRoot;
  }
}

export default BaseRenderer;
