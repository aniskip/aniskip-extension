import { browser } from 'webextension-polyfill-ts';
import { Message } from '../../scripts/background';
import { BasePlayer } from '../base-player';
import { Metadata } from '../base-player.types';
import metadata from './metadata.json';

export class Plyr extends BasePlayer {
  constructor() {
    super(metadata);

    (async (): Promise<void> => {
      const { providerName } = await browser.runtime.sendMessage({
        type: 'get-episode-information',
      } as Message);

      // AniMixPlay player already has frame scrubbing.
      if (providerName !== 'AniMixPlay') {
        return;
      }

      window.removeEventListener('keydown', this.keydownEventHandler);

      this.keydownEventHandler = (): void => {};
      this.injectPlayerControlKeybinds();
    })();
  }

  static getMetadata(): Metadata {
    return metadata;
  }

  getVideoContainer(): HTMLElement | null {
    return super.getContainerHelper(metadata.videoContainerSelectorString);
  }

  getVideoControlsContainer(): HTMLElement | null {
    return super.getContainerHelper(
      metadata.videoControlsContainerSelectorString
    );
  }

  getSettingsButtonElement(): HTMLElement | null {
    return super.getContainerHelper(
      metadata.injectMenusButtonsReferenceNodeSelectorString
    );
  }
}
