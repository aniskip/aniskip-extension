import React from 'react';
import ReactDOM from 'react-dom';
import { Overlay } from '../../components';
import { ShadowRootProvider } from '../../utils';
import { BaseRenderer } from '../base-renderer';

export class OverlayRenderer extends BaseRenderer {
  render(): void {
    ReactDOM.render(
      <ShadowRootProvider value={this.shadowRoot}>
        <Overlay isOpen />
      </ShadowRootProvider>,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}
