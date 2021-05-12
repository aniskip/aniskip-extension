import React from 'react';
import ReactDOM from 'react-dom';

import BaseRenderer from './base_renderer';
import Menus from '../components/Menus';
import { MenusState } from '../types/components/menus_types';

class MenusRenderer extends BaseRenderer {
  variant: string;

  state: MenusState;

  submitMenuOnSubmit: CallableFunction;

  submitMenuOnClose: CallableFunction;

  voteMenuOnClose: CallableFunction;

  constructor(
    id: string,
    variant: string,
    submitMenuOnSubmit: CallableFunction,
    submitMenuOnClose: CallableFunction,
    voteMenuOnClose: CallableFunction
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
      skipTimes: [],
    };
    this.submitMenuOnSubmit = submitMenuOnSubmit;
    this.submitMenuOnClose = submitMenuOnClose;
    this.voteMenuOnClose = voteMenuOnClose;
  }

  /**
   * Set menus state
   * @param newState New state of menus
   */
  setMenusState(newState: MenusState) {
    this.state = newState;
    this.render();
  }

  /**
   * Reset menus state
   */
  resetState() {
    this.setMenusState({
      isSubmitMenuHidden: true,
      isVoteMenuHidden: true,
      skipTimes: [],
    });
  }

  render() {
    ReactDOM.render(
      <Menus
        submitMenuProps={{
          variant: this.variant,
          hidden: this.state.isSubmitMenuHidden,
          onSubmit: this.submitMenuOnSubmit,
          onClose: this.submitMenuOnClose,
        }}
        voteMenuProps={{
          variant: this.variant,
          hidden: this.state.isVoteMenuHidden,
          skipTimes: this.state.skipTimes,
          onClose: this.voteMenuOnClose,
        }}
      />,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}

export default MenusRenderer;
