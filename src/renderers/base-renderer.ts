import { createRoot, Root } from 'react-dom/client';
// @ts-ignore: Tailwind CSS inline styles.
import tailwindStyleString from 'tailwindcss/tailwind.css?inline';
import { Renderer } from './base-renderer.types';
// @ts-ignore: Player inline styles.
import playerStyleString from '../players/styles.scss?inline';

export abstract class BaseRenderer implements Renderer {
  id: string;

  reactRootId: string;

  shadowRoot: ShadowRoot;

  shadowRootContainer: HTMLDivElement;

  reactRoot: Root;

  constructor(id: string, stopPropagationEvents: string[] = []) {
    this.id = id;
    this.reactRootId = `${id}-root`;
    this.shadowRootContainer = document.createElement('div');
    this.shadowRootContainer.setAttribute('id', this.id);
    this.shadowRoot = this.createShadowRoot(
      this.shadowRootContainer,
      stopPropagationEvents
    );
    const container = this.shadowRoot.getElementById(this.reactRootId);
    this.reactRoot = createRoot(container!);
  }

  abstract render(): void;

  /**
   * Creates a shadow root initialised with the tailwindcss stylesheet.
   *
   * @param container Container element to add shadow root to.
   * @param stopPropagationEvents Events to stop propagation of.
   */
  createShadowRoot(
    container: HTMLDivElement,
    stopPropagationEvents: string[] = []
  ): ShadowRoot {
    const shadowRoot = container.attachShadow({
      mode: 'closed',
    });

    stopPropagationEvents.forEach((eventName) => {
      container.addEventListener(eventName, (event) => {
        event.stopPropagation();
      });
    });

    // Inject styles using inline webpack loaders.
    const tailwindcssStyle = document.createElement('style');
    tailwindcssStyle.textContent = tailwindStyleString;
    shadowRoot.appendChild(tailwindcssStyle);

    const playerScriptStyle = document.createElement('style');
    playerScriptStyle.textContent = playerStyleString;
    shadowRoot.appendChild(playerScriptStyle);

    const reactRoot = document.createElement('div');
    reactRoot.setAttribute('id', this.reactRootId);
    shadowRoot.appendChild(reactRoot);

    return shadowRoot;
  }
}
