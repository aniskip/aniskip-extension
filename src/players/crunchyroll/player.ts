import React from 'react';
import ReactDOM from 'react-dom';
import { SubmitButtonContainerProps } from '../../types/components/submit_types';
import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Crunchyroll extends BasePlayer {
  getVideoContainer() {
    return this.document.getElementById(metadata.videoContainerSelectorString);
  }

  injectSettingsButton(settingsButton: React.FC<SubmitButtonContainerProps>) {
    const id = 'opening-skipper-player-settings-button';
    if (this.document.getElementById(id)) {
      return;
    }
    const referenceNode = document.getElementById(
      metadata.injectSettingsButtonReferenceNodeSelectorString
    );
    if (!referenceNode) {
      return;
    }
    const settingsButtonContainerDiv = document.createElement('div');
    settingsButtonContainerDiv.setAttribute('style', metadata.buttonStyle);
    settingsButtonContainerDiv.setAttribute('id', id);
    ReactDOM.render(
      React.createElement<SubmitButtonContainerProps>(settingsButton, {
        width: '40px',
        height: '40px',
        iconWidth: '50%',
        iconHeight: '50%',
        iconColour: 'white',
      }),
      settingsButtonContainerDiv
    );
    referenceNode.insertAdjacentElement(
      'beforebegin',
      settingsButtonContainerDiv
    );
  }
}

export default Crunchyroll;
