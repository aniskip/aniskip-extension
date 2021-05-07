import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Plyr extends BasePlayer {
  constructor(document: Document, videoElement: HTMLVideoElement) {
    super(document, videoElement, metadata);
  }

  getVideoContainer() {
    return super.getContainerHelper(metadata.videoContainerSelectorString, 0);
  }

  getVideoControlsContainer() {
    return super.getContainerHelper(
      metadata.videoControlsContainerSelectorString,
      0
    );
  }

  injectSubmitMenu() {
    const referenceNode = document.getElementsByClassName(
      metadata.injectSettingsButtonReferenceNodeSelectorString
    )[0] as HTMLElement;
    if (referenceNode) {
      this.injectSubmitMenuHelper(referenceNode, metadata.variant);
    }
  }
}

export default Plyr;
