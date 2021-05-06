import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Doodstream extends BasePlayer {
  constructor(document: Document, videoElement: HTMLVideoElement) {
    super(document, videoElement, metadata.variant);
  }

  getVideoContainer() {
    return this.document.getElementById(metadata.videoContainerSelectorString);
  }

  getSeekBarContainer() {
    return super.getContainerHelper(metadata.seekBarContainerSelectorString, 0);
  }

  injectSubmitButton() {
    const referenceNode = document.getElementsByClassName(
      metadata.injectSettingsButtonReferenceNodeSelectorString
    )[0] as HTMLElement;
    this.injectSubmitButtonHelper(referenceNode, metadata.variant);
  }
}

export default Doodstream;
