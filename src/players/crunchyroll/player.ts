import { SkipTime } from '../../types/api/skip_time_types';
import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Crunchyroll extends BasePlayer {
  getVideoContainer() {
    return this.document.getElementById(metadata.videoContainerSelectorString);
  }

  getSeekBarContainer() {
    return super.getContainerHelper(metadata.seekBarContainerSelectorString, 0);
  }

  injectSubmitButton() {
    const referenceNode = document.getElementById(
      metadata.injectSettingsButtonReferenceNodeSelectorString
    );
    if (referenceNode) {
      this.injectSubmitButtonHelper(referenceNode, metadata.variant);
    }
  }

  injectSkipTimeIndicator(skipTime: SkipTime) {
    const container = this.getSeekBarContainer();
    if (container) {
      this.injectSkipTimeIndicatornHelper(container, skipTime);
    }
    console.log(this.document);
  }
}

export default Crunchyroll;
