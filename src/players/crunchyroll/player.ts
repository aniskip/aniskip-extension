import { SkipTime } from '../../types/api/skip_time_types';
import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Crunchyroll extends BasePlayer {
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

  injectSkipTimeIndicator(skipTime: SkipTime) {
    const container = this.getSeekBarContainer();
    if (container) {
      this.injectSkipTimeIndicatornHelper(container, skipTime);
    }
  }
}

export default Crunchyroll;
