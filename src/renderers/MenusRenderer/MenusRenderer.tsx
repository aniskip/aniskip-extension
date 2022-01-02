import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BaseRenderer } from '../base-renderer';
import { Menus } from '../../components';
import { Store } from '../../data';
import { Player } from '../../players/base-player.types';
import { PlayerProvider, VariantProvider } from '../../utils';

export class MenusRenderer extends BaseRenderer {
  variant: string;

  store: Store;

  player: Player;

  constructor(id: string, variant: string, store: Store, player: Player) {
    super(id, [
      'keydown',
      'keyup',
      'mousedown',
      'mouseup',
      'click',
      'dblclick',
    ]);

    this.variant = variant;
    this.store = store;
    this.player = player;
  }

  render(): void {
    ReactDOM.render(
      <Provider store={this.store}>
        <PlayerProvider value={this.player}>
          <VariantProvider value={this.variant}>
            <Menus />
          </VariantProvider>
        </PlayerProvider>
      </Provider>,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}
