import React from 'react';
import ReactDOM from 'react-dom';

import BaseRenderer from './base_renderer';
import Menus from '../components/Menus';
import { MenusState } from '../types/components/menus_types';

class MenusRenderer extends BaseRenderer {
  variant: string;

  state: MenusState;

  onSubmit: CallableFunction;

  onClose: CallableFunction;

  constructor(
    id: string,
    variant: string,
    onSubmit: CallableFunction,
    onClose: CallableFunction
  ) {
    super(id, [
      'keydown',
      'keyup',
      'mousedown',
      'mouseup',
      'click',
      'dblclick',
    ]);

    this.variant = variant;
    this.state = {
      isSubmitMenuHidden: true,
      isVoteMenuHidden: true,
    };
    this.onSubmit = onSubmit;
    this.onClose = onClose;
  }

  /**
   * Set menus state
   * @param newState New state of menus
   */
  setMenusState(newState: MenusState) {
    this.state = newState;
    this.render();
  }

  render() {
    ReactDOM.render(
      <Menus
        variant={this.variant}
        submitMenuProps={{
          hidden: this.state.isSubmitMenuHidden,
          onSubmit: this.onSubmit,
          onClose: this.onClose,
        }}
        voteMenuProps={{
          hidden: this.state.isVoteMenuHidden,
          onClose: () => {},
        }}
      />,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}

export default MenusRenderer;
