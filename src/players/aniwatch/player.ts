import React from 'react';
import ReactDOM from 'react-dom';
import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Aniwatch extends BasePlayer {
  getSettingsContainer() {
    return super.getSettingsContainerHelper(metadata.settingsSelectorString);
  }

  getVideoContainer() {
    return super.getVideoContainerHelper(metadata.videoContainerSelectorString);
  }

  injectSettingsButton(settingsButton: React.FC) {
    const settingContainer = this.getSettingsContainer();
    const settingsButtonContainerDiv = document.createElement('div');
    settingsButtonContainerDiv.setAttribute('style', metadata.buttonStyle);
    const referenceNode = document.getElementsByClassName(
      metadata.injectSettingsButtonReferenceNodeSelectorString
    )[0];
    ReactDOM.render(
      React.createElement(settingsButton),
      settingsButtonContainerDiv
    );
    settingContainer.insertBefore(settingsButtonContainerDiv, referenceNode);
  }
}

export default Aniwatch;
