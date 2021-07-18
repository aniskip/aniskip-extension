import React from 'react';
import ReactDOM from 'react-dom';

import SkipTimeIndicator from '../components/SkipTimeIndicator';
import { SkipTimeType } from '../types/api/aniskip_types';
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
    const reactRoot = this.shadowRoot.getElementById(this.reactRootId);
    if (reactRoot) {
      reactRoot.style.width = '100%';
      reactRoot.style.height = '100%';
    }
  }

  /**
   * Adds a skip time indicator into the player.
   *
   * @param skipTime Skip time to add.
   */
  addSkipTimeIndicator(skipTime: SkipTimeType): void {
    this.skipTimes.push(skipTime);
    this.render();
  }

  /**
   * Removes a skip time indicator into the player.
   *
   * @param skipId SkipId of the skip time to remove.
   */
  removeSkipTimeIndicator(skipId: string): void {
    this.skipTimes = this.skipTimes.filter(
      ({ skip_id: currentSkipId }) => currentSkipId !== skipId
    );
    this.render();
  }

  /**
   * Removes all the skip time indicators from the player.
   */
  clearSkipTimeIndicators(): void {
    this.skipTimes = [];
    this.render();
  }

  /**
   * Sets video duration.
   *
   * @param videoDuration Video duration.
   */
  setVideoDuration(videoDuration: number): void {
    this.videoDuration = videoDuration;
    this.render();
  }

  render(): void {
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
