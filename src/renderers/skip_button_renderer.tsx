import React from 'react';
import ReactDOM from 'react-dom';
import SkipButton from '../components/SkipButton';
import { SkipTimeType } from '../types/api/aniskip_types';
import { SkipButtonOnClickHandler } from '../types/components/skip_time_button_types';

import BaseRenderer from './base_renderer';

class SkipButtonsRenderer extends BaseRenderer {
  variant: string;

  isHidden: boolean;

  skipTimes: SkipTimeType[];

  onClickHandlers: SkipButtonOnClickHandler[];

  videoDuration: number;

  currentTime: number;

  constructor(id: string, variant: string) {
    super(id, ['keydown', 'keyup', 'mousedown', 'mouseup', 'click']);

    this.variant = variant;
    this.isHidden = true;
    this.skipTimes = [];
    this.onClickHandlers = [];
    this.videoDuration = 0;
    this.currentTime = 0;
  }

  /**
   * Adds a skip button into the player
   * @param skipTime Skip time for the skip button
   * @param onClickHandler On click handler for skip button
   */
  addSkipButton(
    skipTime: SkipTimeType,
    onClickHandler: SkipButtonOnClickHandler
  ): void {
    this.skipTimes.push(skipTime);
    this.onClickHandlers.push(onClickHandler);
    this.render();
  }

  /**
   * Removes a skip button into the player
   * @param skipId Skip id of skip time of the skip button to remove
   */
  removeSkipButton(skipId: string): void {
    const skipTimeIndex = this.skipTimes.findIndex(
      ({ skip_id: currentSkipId }) => currentSkipId === skipId
    );
    if (skipTimeIndex !== -1) {
      this.skipTimes.splice(skipTimeIndex, 1);
      this.onClickHandlers.splice(skipTimeIndex, 1);
    }
    this.render();
  }

  /**
   * Sets video duration
   * @param videoDuration Video duration
   */
  setVideoDuration(videoDuration: number): void {
    this.videoDuration = videoDuration;
    this.render();
  }

  /**
   * Sets current time
   * @param currentTime Current time of the video
   */
  setCurrentTime(currentTime: number): void {
    this.currentTime = currentTime;
    this.render();
  }

  /**
   * Removes all the skip buttons from the player
   */
  clearSkipButtons(): void {
    this.skipTimes = [];
    this.onClickHandlers = [];
    this.render();
  }

  render(): void {
    ReactDOM.render(
      <SkipButton
        skipTimes={this.skipTimes}
        variant={this.variant}
        currentTime={this.currentTime}
        videoDuration={this.videoDuration}
        onClickHandlers={this.onClickHandlers}
      />,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}

export default SkipButtonsRenderer;
