import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BaseRenderer } from '../base_renderer';
import { SkipTimeIndicatorContainer as SkipTimeIndicator } from '../../components';
import { Store } from '../../data';
import { Player } from '../../players/base_player.types';
import { PlayerProvider } from '../../utils';

export class SkipTimeIndicatorsRenderer extends BaseRenderer {
  variant: string;

  store: Store;

  player: Player;

  constructor(id: string, variant: string, store: Store, player: Player) {
    super(id);

    this.variant = variant;
    this.store = store;
    this.player = player;

    const reactRoot = this.shadowRoot.getElementById(this.reactRootId);
    if (reactRoot) {
      reactRoot.style.width = '100%';
      reactRoot.style.height = '100%';
    }
  }

  render(): void {
    ReactDOM.render(
      <Provider store={this.store}>
        <PlayerProvider value={this.player}>
          <SkipTimeIndicator variant={this.variant} />
        </PlayerProvider>
      </Provider>,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}
