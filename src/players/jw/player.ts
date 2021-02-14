import { SkipTime } from '../../types/api/skip_time_types';
import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Jw extends BasePlayer {
  getVideoContainer() {
    return this.document.querySelector(
      `[aria-label="${metadata.videoContainerSelectorString}"]`
    ) as HTMLElement;
  }

  getSeekBarContainer() {
    return super.getContainerHelper(metadata.seekBarContainerSelectorString, 0);
  }

  injectSubmitButton() {
    const referenceNode = document.querySelector(
      `[aria-label="${metadata.injectSettingsButtonReferenceNodeSelectorString}"]`
    ) as HTMLElement;
    this.injectSubmitButtonHelper(referenceNode, metadata.variant);
  }

  injectSkipTimeIndicator(skipTime: SkipTime) {
    const container = this.getSeekBarContainer();
    if (container) {
      this.injectSkipTimeIndicatornHelper(container, skipTime);
    }
  }
}

export default Jw;
