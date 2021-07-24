import BasePlayer from '../base_player';
import metadata from './metadata.json';

export class Twistmoe extends BasePlayer {
  constructor(document: Document) {
    super(document, metadata);
  }

  getVideoContainer(): HTMLElement | null {
    return super.getContainerHelper(metadata.videoContainerSelectorString);
  }

  getVideoControlsContainer(): HTMLElement | null {
    return super.getContainerHelper(
      metadata.videoControlsContainerSelectorString
    );
  }

  getSettingsButtonElement(): HTMLElement | null {
    return super.getContainerHelper(
      metadata.injectMenusButtonsReferenceNodeSelectorString
    );
  }
}
