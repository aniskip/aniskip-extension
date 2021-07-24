import React from 'react';
import ReactDOM from 'react-dom';

import { BaseRenderer } from '../base_renderer';
import {
  SubmitMenuButtonOnClickHandler,
  VoteMenuButtonOnClickHandler,
  PlayerButtonsState,
  PlayerButtons,
} from '../../components';

export class PlayerButtonsRenderer extends BaseRenderer {
  variant: string;

  state: PlayerButtonsState;

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
  setState(newState: PlayerButtonsState): void {
    this.state = newState;
    this.render();
  }

  render(): void {
    ReactDOM.render(
      <PlayerButtons
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
