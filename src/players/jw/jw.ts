import { BasePlayer } from '../base-player';
import { Metadata } from '../base-player.types';
import metadata from './metadata.json';

export class Jw extends BasePlayer {
  constructor() {
    super(metadata);
  }

  static getMetadata(): Metadata {
    return metadata;
  }

  getVideoContainer(): HTMLElement | null {
    return document.querySelector<HTMLElement>(
      `[aria-label="${this.metadata.selectorStrings.default.videoContainerSelectorString}"]`
    );
  }

  getVideoControlsContainer(): HTMLElement | null {
    return super.getContainerHelper(
      this.metadata.selectorStrings.default.videoControlsContainerSelectorString
    );
  }

  getSeekBarContainer(): HTMLElement | null {
    const slider = document.querySelector<HTMLElement>(
      `[aria-label^="${this.metadata.selectorStrings.default.seekBarContainerSelectorString}"]`
    );
    const firstChild = slider?.firstChild;
    if (firstChild) {
      return firstChild as HTMLElement;
    }
    return null;
  }

  getSettingsButtonElement(): HTMLElement | null {
    return document.querySelector<HTMLElement>(
      `[aria-label="${this.metadata.selectorStrings.default.injectMenusButtonsReferenceNodeSelectorString}"][tabindex="0"]`
    );
  }
}
