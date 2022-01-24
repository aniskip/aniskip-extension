import { isMobile } from 'react-device-detect';
import { BasePlayer } from '../base-player';
import { Metadata } from '../base-player.types';
import metadata from './metadata.json';

export class Crunchyroll extends BasePlayer {
  constructor() {
    super(metadata);
  }

  static getMetadata(): Metadata {
    return metadata;
  }

  getSeekBarContainer(): HTMLElement | null {
    if (isMobile) {
      return super.getContainerHelper(
        this.metadata.selectorStrings.default!
          .seekBarContainerSelectorStringMobile!
      );
    }

    return super.getContainerHelper(
      this.metadata.selectorStrings.default!.seekBarContainerSelectorString,
      1
    );
  }

  getVideoControlsContainer(): HTMLElement | null {
    if (isMobile && this.isReady) {
      return document.getElementById(
        this.metadata.selectorStrings.default!
          .videoControlsContainerSelectorStringMobile!
      );
    }

    return super.getVideoControlsContainer();
  }

  initialise(): void {
    super.initialise();

    const controlsPackage = super.getVideoControlsContainer();

    if (!controlsPackage) {
      return;
    }

    new MutationObserver(async () => {
      this.injectSubmitMenuButton();
      this.injectSkipTimeIndicator();
      this.injectSkipButtons();
      this.skipButtonRenderer.render();
    }).observe(controlsPackage, { childList: true });
  }

  isControlsVisible(): boolean {
    if (isMobile) {
      return super.isControlsVisible();
    }

    return !!document.getElementById(this.playerButtonsRenderer.id);
  }
}
