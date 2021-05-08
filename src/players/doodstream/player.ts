import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Doodstream extends BasePlayer {
  constructor(document: Document, videoElement: HTMLVideoElement) {
    super(document, videoElement, metadata);
  }

  getVideoControlsContainer() {
    return super.getContainerHelper(
      metadata.videoControlsContainerSelectorString
    );
  }

  getSettingsButtonElement() {
    return super.getContainerHelper(
      metadata.injectSettingsButtonReferenceNodeSelectorString
    );
  }
}

export default Doodstream;
