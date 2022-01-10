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
}
