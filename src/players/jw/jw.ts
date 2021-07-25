import { BasePlayer } from '../base_player';
import metadata from './metadata.json';

export class Jw extends BasePlayer {
  constructor(document: Document) {
    super(document, metadata);
  }

  getVideoContainer(): HTMLElement | null {
    return this.document.querySelector<HTMLElement>(
      `[aria-label="${metadata.videoContainerSelectorString}"]`
    );
  }

  getVideoControlsContainer(): HTMLElement | null {
    return super.getContainerHelper(
      metadata.videoControlsContainerSelectorString
    );
  }

  getSeekBarContainer(): HTMLElement | null {
    const slider = this.document.querySelector<HTMLElement>(
      `[aria-label^="${metadata.seekBarContainerSelectorString}"]`
    );
    const firstChild = slider?.firstChild;
    if (firstChild) {
      return firstChild as HTMLElement;
    }
    return null;
  }

  getSettingsButtonElement(): HTMLElement | null {
    return this.document.querySelector<HTMLElement>(
      `[aria-label="${metadata.injectMenusButtonsReferenceNodeSelectorString}"]`
    );
  }
}
