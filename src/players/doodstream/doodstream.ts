import { BasePlayer } from '../base-player';
import metadata from './metadata.json';

export class Doodstream extends BasePlayer {
  constructor(document: Document) {
    super(document, metadata);
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
