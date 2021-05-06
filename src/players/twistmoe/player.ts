import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Twistmoe extends BasePlayer {
  constructor(document: Document, videoElement: HTMLVideoElement) {
    super(document, videoElement, metadata.variant);
  }

  getVideoContainer() {
    return super.getContainerHelper(metadata.videoContainerSelectorString, 0);
  }

  getSeekBarContainer() {
    return super.getContainerHelper(metadata.seekBarContainerSelectorString, 0);
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

export default Twistmoe;
