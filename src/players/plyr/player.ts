import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Plyr extends BasePlayer {
  constructor(document: Document, videoElement: HTMLVideoElement) {
    super(document, videoElement, metadata);
  }

  getVideoContainer() {
    return super.getContainerHelper(metadata.videoContainerSelectorString);
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

export default Plyr;
