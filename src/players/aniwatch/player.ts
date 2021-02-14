import { SkipTime } from '../../types/api/skip_time_types';
import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Aniwatch extends BasePlayer {
  getVideoContainer() {
    return super.getContainerHelper(metadata.videoContainerSelectorString, 0);
  }

  getSeekBarContainer() {
    const container = super.getContainerHelper(
      metadata.seekBarContainerSelectorString,
      0
    );
    console.log({ container });
    return container;
  }

  injectSubmitButton() {
    const referenceNode = document.getElementsByClassName(
      metadata.injectSettingsButtonReferenceNodeSelectorString
    )[0] as HTMLElement;
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

export default Aniwatch;
