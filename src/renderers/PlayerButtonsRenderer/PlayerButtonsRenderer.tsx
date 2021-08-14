import React from 'react';
import ReactDOM from 'react-dom';
import { BaseRenderer } from '../base_renderer';
import { PlayerButtons } from '../../components';
import { Store } from '../../data';
import { Provider } from 'react-redux';

export class PlayerButtonsRenderer extends BaseRenderer {
  variant: string;

  store: Store;

  constructor(id: string, variant: string, store: Store) {
    super(id, ['keydown', 'keyup', 'mousedown', 'mouseup', 'click']);

    this.variant = variant;
    this.store = store;
  }

  render(): void {
    ReactDOM.render(
      <Provider store={this.store}>
        <PlayerButtons variant={this.variant} />
      </Provider>,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}
