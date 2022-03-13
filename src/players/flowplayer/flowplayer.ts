import { getDomainName } from '../../utils';
import { BasePlayer } from '../base-player';
import { Metadata } from '../base-player.types';
import metadata from './metadata.json';

export class Flowplayer extends BasePlayer {
  constructor() {
    super(metadata);
  }

  static getMetadata(): Metadata {
    return metadata;
  }

  getVideoContainer(): HTMLElement | null {
    return super.getContainerHelper(
      this.metadata.selectorStrings.default!.videoContainerSelectorString
    );
  }

  getVideoControlsContainer(): HTMLElement | null {
    const domainName = getDomainName(window.location.hostname);
    const { selectorStrings } = this.metadata;

    return super.getContainerHelper(
      selectorStrings[domainName]?.videoControlsContainerSelectorString ??
        selectorStrings.default!.videoControlsContainerSelectorString
    );
  }

  getSettingsButtonElement(): HTMLElement | null {
    const domainName = getDomainName(window.location.hostname);
    const { selectorStrings } = this.metadata;

    return super.getContainerHelper(
      selectorStrings[domainName]
        ?.injectMenusButtonsReferenceNodeSelectorString ??
        selectorStrings.default!.injectMenusButtonsReferenceNodeSelectorString
    );
  }

  injectSubmitMenuButton(): void {
    const settingsButtonElement = this.getSettingsButtonElement();

    if (
      !settingsButtonElement ||
      document.getElementById(this.playerButtonsRenderer.id)
    ) {
      return;
    }

    settingsButtonElement.insertAdjacentElement(
      'afterend',
      this.playerButtonsRenderer.shadowRootContainer
    );
    this.playerButtonsRenderer.render();

    // Hack to ensure that player buttons are not offscreen.
    const videoControlsContainer = this.getVideoControlsContainer();
    if (videoControlsContainer) {
      videoControlsContainer.style.display = 'flex';
    }
  }
}
