import React from 'react';
import ReactDOM from 'react-dom';
import { SubmitButtonContainerProps } from '../../types/components/submit_types';
import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Crunchyroll extends BasePlayer {
  getVideoContainer() {
    return this.document.getElementById(metadata.videoContainerSelectorString);
  }

  injectSubmitButton(submitButton: React.FC<SubmitButtonContainerProps>) {
    const id = 'opening-skipper-player-submit-button';
    if (this.document.getElementById(id)) {
      return;
    }
    const referenceNode = document.getElementById(
      metadata.injectSettingsButtonReferenceNodeSelectorString
    );
    if (!referenceNode) {
      return;
    }
    const submitButtonContainerDiv = document.createElement('div');
    submitButtonContainerDiv.setAttribute('id', id);
    ReactDOM.render(
      React.createElement<SubmitButtonContainerProps>(submitButton, {
        variant: 'crunchyroll',
      }),
      submitButtonContainerDiv
    );
    referenceNode.insertAdjacentElement(
      'beforebegin',
      submitButtonContainerDiv
    );
  }
}

export default Crunchyroll;
