import { getDomainName } from '../../utils';
import { BasePlayer } from '../base-player';
import { Metadata } from '../base-player.types';
import metadata from './metadata.json';

export class Videojs extends BasePlayer {
  constructor() {
    super(metadata);
  }

  static getMetadata(): Metadata {
    return metadata;
  }

  getVideoContainer(): HTMLVideoElement | null {
    const videoControlsContainer = this.getVideoControlsContainer();

    return videoControlsContainer?.parentElement as HTMLVideoElement | null;
  }

  getVideoControlsContainer(): HTMLElement | null {
    const domainName = getDomainName(window.location.hostname);

    return super.getContainerHelper(
      this.metadata.selectorStrings[domainName]
        .videoControlsContainerSelectorString ??
        this.metadata.selectorStrings.default
          .videoControlsContainerSelectorString
    );
  }

  getSettingsButtonElement(): HTMLElement | null {
    const domainName = getDomainName(window.location.hostname);

    return super.getContainerHelper(
      this.metadata.selectorStrings[domainName]
        .injectMenusButtonsReferenceNodeSelectorString ??
        this.metadata.selectorStrings.default
          .injectMenusButtonsReferenceNodeSelectorString
    );
  }
}
