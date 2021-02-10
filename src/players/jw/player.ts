import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Jw extends BasePlayer {
  getVideoContainer() {
    return this.document.querySelector(
      `[aria-label="${metadata.videoContainerSelectorString}"]`
    ) as HTMLElement;
  }

  injectSubmitButton() {
    const referenceNode = document.querySelector(
      `[aria-label="${metadata.injectSettingsButtonReferenceNodeSelectorString}"]`
    ) as HTMLElement;
    this.injectSubmitButtonHelper(referenceNode, metadata.variant);
  }
}

export default Jw;
