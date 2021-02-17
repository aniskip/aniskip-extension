import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Jw extends BasePlayer {
  getVideoContainer() {
    return this.document.querySelector<HTMLElement>(
      `[aria-label="${metadata.videoContainerSelectorString}"]`
    );
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

  injectSubmitButton() {
    const referenceNode = document.querySelector<HTMLElement>(
      `[aria-label="${metadata.injectSettingsButtonReferenceNodeSelectorString}"]`
    );
    if (referenceNode) {
      this.injectSubmitButtonHelper(referenceNode, metadata.variant);
    }
  }
}

export default Jw;
