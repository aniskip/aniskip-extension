import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Crunchyroll extends BasePlayer {
  constructor(document: Document, videoElement: HTMLVideoElement) {
    super(document, videoElement, metadata.variant);
  }

  getVideoContainer() {
    return this.document.getElementById(metadata.videoContainerSelectorString);
  }

  getSeekBarContainer() {
    return super.getContainerHelper(metadata.seekBarContainerSelectorString, 1);
  }

  injectSubmitButton() {
    const referenceNode = document.getElementById(
      metadata.injectSettingsButtonReferenceNodeSelectorString
    );
    if (referenceNode) {
      this.injectSubmitButtonHelper(referenceNode, metadata.variant);
    }
  }
}

export default Crunchyroll;
