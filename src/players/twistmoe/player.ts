import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Twistmoe extends BasePlayer {
  constructor(document: Document) {
    super(document, metadata);
  }

  getVideoContainer() {
    return super.getContainerHelper(metadata.videoContainerSelectorString, 0);
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

export default Twistmoe;
