import React from 'react';
import ReactDOM from 'react-dom';
import SubmitMenu from '../components/SubmitMenu';
import { SubmitButtonClickHandler } from '../types/components/submit_types';

import BaseRenderer from './base_renderer';

class SubmitMenuButtonRenderer extends BaseRenderer {
  variant: string;

  isActive: boolean;

  clickHandler: SubmitButtonClickHandler;

  constructor(
    id: string,
    variant: string,
    clickHandler: SubmitButtonClickHandler
  ) {
    super(id, ['keydown', 'keyup', 'mousedown', 'mouseup', 'click']);

    this.variant = variant;
    this.isActive = false;
    this.clickHandler = clickHandler;
  }

  /**
   * Set is active field
   * @param isActive Is menu button active new value
   */
  setIsActive(isActive: boolean) {
    this.isActive = isActive;
    this.render();
  }

  render() {
    ReactDOM.render(
      <SubmitMenu.Button
        active={this.isActive}
        variant={this.variant}
        handleClick={this.clickHandler}
      />,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}

export default SubmitMenuButtonRenderer;
