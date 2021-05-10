import React from 'react';
import ReactDOM from 'react-dom';

import SkipTimeIndicator from '../components/SkipTimeIndicator';
import { SkipTimeType } from '../types/api/skip_time_types';
import BaseRenderer from './base_renderer';

class SkipTimeIndicatorsRenderer extends BaseRenderer {
  variant: string;

  videoDuration: number;

  skipTimes: SkipTimeType[];

  constructor(id: string, variant: string) {
    super(id);

    this.variant = variant;
    this.videoDuration = 0;
    this.skipTimes = [];
  }

  /**
   * Adds a skip time indicator into the player
   * @param skipTime Skip time to add
   */
  addSkipTimeIndicator(skipTime: SkipTimeType) {
    this.skipTimes.push(skipTime);
    this.render();
  }

  /**
   * Removes a skip time indicator into the player
   * @param skipTime Skip time to remove
   */
  removeSkipTimeIndicator(skipTime: SkipTimeType) {
    this.skipTimes = this.skipTimes.filter(
      ({ skip_id: currentSkipId }) => currentSkipId !== skipTime.skip_id
    );
    this.render();
  }

  /**
   * Removes all the skip time indicators from the player
   */
  clearSkipTimeIndicators() {
    this.skipTimes = [];
    this.render();
  }

  /**
   * Sets video duration
   * @param videoDuration Video duration
   */
  setVideoDuration(videoDuration: number) {
    this.videoDuration = videoDuration;
    this.render();
  }

  render() {
    ReactDOM.render(
      <SkipTimeIndicator
        skipTimes={this.skipTimes}
        videoDuration={this.videoDuration}
        variant={this.variant}
      />,
      this.shadowRoot.getElementById(this.reactRootId)
    );
  }
}

export default SkipTimeIndicatorsRenderer;
