import React from 'react';
import ReactDOM from 'react-dom';

import SubmitMenu from '../components/SubmitMenu';
import BaseRenderer from './base_renderer';

class SubmitMenuRenderer extends BaseRenderer {
  variant: string;

  isHidden: boolean;

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
    this.isHidden = true;
    this.onSubmit = onSubmit;
    this.onClose = onClose;
  }

  /**
   * Set is hidden field
   * @param isHidden Is menu hidden new value
   */
  setIsHidden(isHidden: boolean) {
    this.isHidden = isHidden;
    this.render();
  }

  render() {
    ReactDOM.render(
      <SubmitMenu
        variant={this.variant}
        hidden={this.isHidden}
        onSubmit={this.onSubmit}
        onClose={this.onClose}
      />,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}

export default SubmitMenuRenderer;
