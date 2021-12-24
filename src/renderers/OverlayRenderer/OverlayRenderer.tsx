import React from 'react';
import ReactDOM from 'react-dom';
import { Overlay } from '../../components';
import { BaseRenderer } from '../base-renderer';

export class OverlayRenderer extends BaseRenderer {
  render(): void {
    ReactDOM.render(
      <Overlay isOpen />,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}
