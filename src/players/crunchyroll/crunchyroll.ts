import { isMobileCheck } from '../../utils';
import { BasePlayer } from '../base-player';
import { Metadata } from '../base-player.types';
import metadata from './metadata.json';

export class Crunchyroll extends BasePlayer {
  constructor(document: Document) {
    super(document, metadata);
  }

  static getMetadata(): Metadata {
    return metadata;
  }

  getSeekBarContainer(): HTMLElement | null {
    if (isMobileCheck()) {
      return super.getContainerHelper(
        metadata.seekBarContainerSelectorStringMobile
      );
    }

    return super.getContainerHelper(metadata.seekBarContainerSelectorString, 1);
  }

  initialise(): void {
    super.initialise();
    const controlsPackage = this.getVideoControlsContainer();
    if (controlsPackage) {
      new MutationObserver(async () => {
        this.injectSubmitMenuButton();
        this.injectSkipTimeIndicator();
        this.injectSkipButtons();
        this.skipButtonRenderer.render();
      }).observe(controlsPackage, { childList: true });
    }
  }

  isControlsVisible(): boolean {
    return !!this.document.getElementById(this.playerButtonsRenderer.id);
  }
}
