import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Videojs extends BasePlayer {
  constructor(document: Document) {
    super(document, metadata);
  }

  getVideoContainer() {
    const videoControlsContainer = this.getVideoControlsContainer();

    return videoControlsContainer?.parentElement as HTMLVideoElement | null;
  }

  getVideoControlsContainer() {
    return super.getContainerHelper(
      metadata.videoControlsContainerSelectorString
    );
  }

  getSettingsButtonElement() {
    return super.getContainerHelper(
      metadata.injectMenusButtonsReferenceNodeSelectorString
    );
  }
}

export default Videojs;
