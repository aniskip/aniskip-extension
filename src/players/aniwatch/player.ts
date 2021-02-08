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

  injectSubmitButton(submitButton: React.FC<SubmitButtonContainerProps>) {
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
    const submitButtonContainerDiv = document.createElement('div');
    submitButtonContainerDiv.setAttribute('id', id);
    ReactDOM.render(
      React.createElement<SubmitButtonContainerProps>(submitButton, {
        width: '32px',
        height: '32px',
        iconWidth: '75%',
        iconHeight: '75%',
        iconColour: 'white',
      }),
      submitButtonContainerDiv
    );
    referenceNode.insertAdjacentElement(
      'beforebegin',
      submitButtonContainerDiv
    );
  }
}

export default Aniwatch;
