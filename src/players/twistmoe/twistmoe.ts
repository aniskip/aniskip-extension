import { BasePlayer } from '../base-player';
import { Metadata } from '../base-player.types';
import metadata from './metadata.json';

export class Twistmoe extends BasePlayer {
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
    return super.getContainerHelper(
      this.metadata.selectorStrings.default!
        .videoControlsContainerSelectorString
    );
  }

  getSettingsButtonElement(): HTMLElement | null {
    return super.getContainerHelper(
      metadata.selectorStrings.default
        .injectMenusButtonsReferenceNodeSelectorString
    );
  }
}
