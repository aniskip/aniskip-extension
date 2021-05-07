import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Jw extends BasePlayer {
  constructor(document: Document, videoElement: HTMLVideoElement) {
    super(document, videoElement, metadata);
  }

  getVideoContainer() {
    return this.document.querySelector<HTMLElement>(
      `[aria-label="${metadata.videoContainerSelectorString}"]`
    );
  }

  getVideoControlsContainer() {
    return super.getContainerHelper(metadata.videoControlsContainerString, 0);
  }

  getSeekBarContainer() {
    const slider = this.document.querySelector<HTMLElement>(
      `[aria-label^="${metadata.seekBarContainerSelectorString}"]`
    );
    const firstChild = slider?.firstChild;
    if (firstChild) {
      return firstChild as HTMLElement;
    }
    return null;
  }

  injectSubmitMenu() {
    const referenceNode = document.querySelector<HTMLElement>(
      `[aria-label="${metadata.injectSettingsButtonReferenceNodeSelectorString}"]`
    );
    if (referenceNode) {
      this.injectSubmitMenuHelper(referenceNode, metadata.variant);
    }
  }
}

export default Jw;
