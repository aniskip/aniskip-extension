import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Aniwatch extends BasePlayer {
  getVideoContainer() {
    return super.getVideoContainerHelper(
      metadata.videoContainerSelectorString,
      0
    );
  }

  injectSubmitButton() {
    const referenceNode = document.getElementsByClassName(
      metadata.injectSettingsButtonReferenceNodeSelectorString
    )[0] as HTMLElement;
    this.injectSubmitButtonHelper(referenceNode, 'aniwatch');
  }
}

export default Aniwatch;
