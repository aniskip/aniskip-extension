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
      `[aria-label="${metadata.videoContainerSelectorString}"]`
    );
  }

  getVideoControlsContainer(): HTMLElement | null {
    return super.getContainerHelper(
      metadata.videoControlsContainerSelectorString
    );
  }

  getSeekBarContainer(): HTMLElement | null {
    const slider = document.querySelector<HTMLElement>(
      `[aria-label^="${metadata.seekBarContainerSelectorString}"]`
    );
    const firstChild = slider?.firstChild;
    if (firstChild) {
      return firstChild as HTMLElement;
    }
    return null;
  }

  getSettingsButtonElement(): HTMLElement | null {
    return document.querySelector<HTMLElement>(
      `[aria-label="${metadata.injectMenusButtonsReferenceNodeSelectorString}"][tabindex="0"]`
    );
  }
}
