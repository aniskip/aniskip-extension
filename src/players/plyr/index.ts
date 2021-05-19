import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Plyr extends BasePlayer {
  constructor(document: Document) {
    super(document, metadata);
  }

  getVideoContainer() {
    return super.getContainerHelper(metadata.videoContainerSelectorString);
  }

  getVideoControlsContainer() {
    return super.getContainerHelper(
      metadata.videoControlsContainerSelectorString
    );
  }

  getSettingsButtonElement() {
    return super.getContainerHelper(
      metadata.injectMenusButtonsReferenceNodeSelectorString
    );
  }
}

export default Plyr;
