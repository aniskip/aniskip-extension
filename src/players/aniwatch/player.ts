import React from 'react';
import ReactDOM from 'react-dom';
import SettingsButtonProps from '../../types/components/settings_button_types';
import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Aniwatch extends BasePlayer {
  getVideoContainer() {
    return super.getVideoContainerHelper(
      metadata.videoContainerSelectorString,
      0
    );
  }

  injectSettingsButton(settingsButton: React.FC<SettingsButtonProps>) {
    const id = 'opening-skipper-player-settings-button';
    if (this.document.getElementById(id)) {
      return;
    }
    const referenceNode = document.getElementsByClassName(
      metadata.injectSettingsButtonReferenceNodeSelectorString
    )[0];
    if (!referenceNode) {
      return;
    }
    const settingsButtonContainerDiv = document.createElement('div');
    settingsButtonContainerDiv.setAttribute('style', metadata.buttonStyle);
    settingsButtonContainerDiv.setAttribute('id', id);
    ReactDOM.render(
      React.createElement<SettingsButtonProps>(settingsButton, {
        width: '75%',
        height: '75%',
        color: 'white',
      }),
      settingsButtonContainerDiv
    );
    referenceNode.insertAdjacentElement(
      'beforebegin',
      settingsButtonContainerDiv
    );
  }
}

export default Aniwatch;
