import React from 'react';
import ReactDOM from 'react-dom';

import { BaseRenderer } from '../base_renderer';
import { Menus, MenusButtonsState } from '../../components/Menus';
import {
  SubmitMenuButtonOnClickHandler,
  VoteMenuButtonOnClickHandler,
} from '../../components';

export class MenusButtonsRenderer extends BaseRenderer {
  variant: string;

  state: MenusButtonsState;

  submitMenuButtonOnClickHandler: SubmitMenuButtonOnClickHandler;

  voteMenuButtonOnClickHandler: VoteMenuButtonOnClickHandler;

  constructor(
    id: string,
    variant: string,
    submitButtonOnClickHandler: SubmitMenuButtonOnClickHandler,
    voteMenuButtonOnClickHandler: VoteMenuButtonOnClickHandler
  ) {
    super(id, ['keydown', 'keyup', 'mousedown', 'mouseup', 'click']);

    this.variant = variant;
    this.state = {
      isSubmitButtonActive: false,
      isVoteButtonActive: false,
    };
    this.submitMenuButtonOnClickHandler = submitButtonOnClickHandler;
    this.voteMenuButtonOnClickHandler = voteMenuButtonOnClickHandler;
  }

  /**
   * Set is submit button active field.
   *
   * @param newState Is submit button active new value.
   */
  setState(newState: MenusButtonsState): void {
    this.state = newState;
    this.render();
  }

  render(): void {
    ReactDOM.render(
      <Menus.Buttons
        variant={this.variant}
        submitMenuButtonProps={{
          active: this.state.isSubmitButtonActive,
          variant: this.variant,
          onClick: this.submitMenuButtonOnClickHandler,
        }}
        voteMenuButtonProps={{
          active: this.state.isVoteButtonActive,
          variant: this.variant,
          onClick: this.voteMenuButtonOnClickHandler,
        }}
      />,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}
