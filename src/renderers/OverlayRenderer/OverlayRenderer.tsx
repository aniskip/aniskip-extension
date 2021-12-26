import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Overlay } from '../../components';
import { Store } from '../../data';
import { ShadowRootProvider } from '../../utils';
import { BaseRenderer } from '../base-renderer';

export class OverlayRenderer extends BaseRenderer {
  store: Store;

  constructor(id: string, store: Store) {
    super(id);

    this.store = store;
  }

  render(): void {
    ReactDOM.render(
      <Provider store={this.store}>
        <ShadowRootProvider value={this.shadowRoot}>
          <Overlay />
        </ShadowRootProvider>
      </Provider>,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}
