import React from 'react';
import ReactDOM from 'react-dom';
import SkipButton from '../components/SkipButton';
import { SkipType } from '../types/api/skip_time_types';
import { SkipButtonClickHandler } from '../types/components/skip_time_button_types';

import BaseRenderer from './base_renderer';

class SkipButtonRenderer extends BaseRenderer {
  variant: string;

  isHidden: boolean;

  skipType: SkipType;

  clickHandler: SkipButtonClickHandler;

  constructor(
    id: string,
    variant: string,
    skipType: SkipType,
    clickHandler: SkipButtonClickHandler
  ) {
    super(id, ['keydown', 'keyup', 'mousedown', 'mouseup', 'click']);

    this.variant = variant;
    this.isHidden = true;
    this.skipType = skipType;
    this.clickHandler = clickHandler;
  }

  render() {
    ReactDOM.render(
      <SkipButton
        skipType={this.skipType}
        variant={this.variant}
        hidden={this.isHidden}
        onClick={this.clickHandler}
      />,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}

export default SkipButtonRenderer;
