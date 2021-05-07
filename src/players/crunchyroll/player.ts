import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Crunchyroll extends BasePlayer {
  constructor(document: Document, videoElement: HTMLVideoElement) {
    super(document, videoElement, metadata);
  }

  getSeekBarContainer() {
    return super.getContainerHelper(metadata.seekBarContainerSelectorString, 1);
  }

  initialise() {
    super.initialise();
    const controlsPackage = this.getVideoControlsContainer();
    if (controlsPackage) {
      new MutationObserver(async () => {
        this.injectSubmitMenu();
        this.injectSkipTimeIndicator();
        this.injectSkipButton();
      }).observe(controlsPackage, { childList: true });
    }
  }

  injectSubmitMenu() {
    const referenceNode = document.getElementById(
      metadata.injectSettingsButtonReferenceNodeSelectorString
    );
    if (referenceNode) {
      this.injectSubmitMenuHelper(referenceNode, metadata.variant);
    }
  }
}

export default Crunchyroll;
