import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Videojs extends BasePlayer {
  constructor(document: Document, videoElement: HTMLVideoElement) {
    super(document, videoElement, metadata);
  }

  getVideoContainer() {
    return this.document.querySelector<HTMLElement>(
      `[aria-label="${metadata.videoContainerSelectorString}"]`
    );
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

export default Videojs;
