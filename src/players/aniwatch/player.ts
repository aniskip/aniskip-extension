import React from 'react';
import ReactDOM from 'react-dom';
import { SubmitButtonContainerProps } from '../../types/components/submit_types';
import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Aniwatch extends BasePlayer {
  getVideoContainer() {
    return super.getVideoContainerHelper(
      metadata.videoContainerSelectorString,
      0
    );
  }

  injectSettingsButton(settingsButton: React.FC<SubmitButtonContainerProps>) {
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
    settingsButtonContainerDiv.setAttribute('id', id);
    ReactDOM.render(
      React.createElement<SubmitButtonContainerProps>(settingsButton, {
        width: '32px',
        height: '32px',
        iconWidth: '75%',
        iconHeight: '75%',
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

export default Aniwatch;
