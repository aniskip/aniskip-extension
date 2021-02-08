import React from 'react';
import ReactDOM from 'react-dom';
import SettingsButtonProps from '../../types/components/settings_button_types';
import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Jw extends BasePlayer {
  getVideoContainer() {
    return this.document.querySelector(
      `[aria-label="${metadata.videoContainerSelectorString}"]`
    ) as HTMLElement;
  }

  injectSettingsButton(settingsButton: React.FC<SettingsButtonProps>) {
    const id = 'opening-skipper-player-settings-button';
    if (this.document.getElementById(id)) {
      return;
    }
    const referenceNode = document.querySelector(
      `[aria-label="${metadata.injectSettingsButtonReferenceNodeSelectorString}"]`
    );
    if (!referenceNode) {
      return;
    }
    const settingsButtonContainerDiv = document.createElement('div');
    settingsButtonContainerDiv.setAttribute('style', metadata.buttonStyle);
    settingsButtonContainerDiv.setAttribute('id', id);
    ReactDOM.render(
      React.createElement<SettingsButtonProps>(settingsButton, {
        width: '50%',
        height: '50%',
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

export default Jw;
