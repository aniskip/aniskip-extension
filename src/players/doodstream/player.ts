import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Doodstream extends BasePlayer {
  constructor(document: Document, videoElement: HTMLVideoElement) {
    super(document, videoElement, metadata);
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
    this.injectSubmitMenuHelper(referenceNode, metadata.variant);
  }
}

export default Doodstream;
