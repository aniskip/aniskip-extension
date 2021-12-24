import React from 'react';
import ReactDOM from 'react-dom';
import { AnimeSearchModal, Overlay } from '../../components';
import { BaseRenderer } from '../base-renderer';

export class OverlayRenderer extends BaseRenderer {
  render(): void {
    ReactDOM.render(
      <Overlay>
        <AnimeSearchModal isOpen />
      </Overlay>,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}
