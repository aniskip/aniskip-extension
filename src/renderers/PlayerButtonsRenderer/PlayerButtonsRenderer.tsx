import React from 'react';
import { Provider } from 'react-redux';
import { BaseRenderer } from '../base-renderer';
import { PlayerButtons } from '../../components';
import { Store } from '../../data';
import { VariantProvider } from '../../utils';

export class PlayerButtonsRenderer extends BaseRenderer {
  variant: string;

  store: Store;

  constructor(id: string, variant: string, store: Store) {
    super(id, ['keydown', 'keyup', 'mousedown', 'mouseup', 'click']);

    this.variant = variant;
    this.store = store;
  }

  render(): void {
    this.reactRoot.render(
      <Provider store={this.store}>
        <VariantProvider value={this.variant}>
          <PlayerButtons />
        </VariantProvider>
      </Provider>
    );
  }
}
