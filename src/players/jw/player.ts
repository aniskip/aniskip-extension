import React from 'react';
import ReactDOM from 'react-dom';
import { SubmitButtonContainerProps } from '../../types/components/submit_types';
import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Jw extends BasePlayer {
  getVideoContainer() {
    return this.document.querySelector(
      `[aria-label="${metadata.videoContainerSelectorString}"]`
    ) as HTMLElement;
  }

  injectSubmitButton(submitButton: React.FC<SubmitButtonContainerProps>) {
    const id = 'opening-skipper-player-submit-button';
    if (this.document.getElementById(id)) {
      return;
    }
    const referenceNode = document.querySelector(
      `[aria-label="${metadata.injectSettingsButtonReferenceNodeSelectorString}"]`
    );
    if (!referenceNode) {
      return;
    }
    const submitButtonContainerDiv = document.createElement('div');
    submitButtonContainerDiv.setAttribute('id', id);
    ReactDOM.render(
      React.createElement<SubmitButtonContainerProps>(submitButton, {
        variant: 'jw',
      }),
      submitButtonContainerDiv
    );
    referenceNode.insertAdjacentElement(
      'beforebegin',
      submitButtonContainerDiv
    );
  }
}

export default Jw;
