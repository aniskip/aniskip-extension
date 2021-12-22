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

  injectSkipButtons(): void {
    if (isMobileCheck()) {
      const seekBarContainer = this.getSeekBarContainer();

      if (
        seekBarContainer &&
        !this.document.getElementById(this.skipButtonRenderer.id)
      ) {
        seekBarContainer.parentElement?.appendChild(
          this.skipButtonRenderer.shadowRootContainer
        );
      }

      return;
    }

    super.injectSkipButtons();
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
      }).observe(controlsPackage, { childList: true });
    }
  }
}
