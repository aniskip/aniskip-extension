import isMobile from '../../utils/responsive_utils';
import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Crunchyroll extends BasePlayer {
  constructor(document: Document) {
    super(document, metadata);
  }

  getSeekBarContainer() {
    if (isMobile()) {
      return super.getContainerHelper(
        'css-1dbjc4n r-13awgt0 r-18u37iz r-1udh08x r-13qz1uu'
      );
    }

    return super.getContainerHelper(metadata.seekBarContainerSelectorString, 1);
  }

  initialise() {
    super.initialise();
    const controlsPackage = this.getVideoControlsContainer();
    if (controlsPackage) {
      new MutationObserver(async () => {
        this.injectSubmitMenuButton();
        this.injectSkipTimeIndicator();
        this.injectSkipButtons();
      }).observe(controlsPackage, { childList: true });
    }
  }
}

export default Crunchyroll;
