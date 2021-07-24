import BasePlayer from '../base_player';
import metadata from './metadata.json';

export class Videojs extends BasePlayer {
  constructor(document: Document) {
    super(document, metadata);
  }

  getVideoContainer(): HTMLVideoElement | null {
    const videoControlsContainer = this.getVideoControlsContainer();

    return videoControlsContainer?.parentElement as HTMLVideoElement | null;
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
