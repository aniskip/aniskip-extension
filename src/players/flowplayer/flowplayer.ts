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
}
