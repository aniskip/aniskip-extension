import { playerControlsListenerTypeUpdated } from '../../data';
import { getDomainName } from '../../utils';
import { BasePlayer } from '../base-player';
import { Metadata } from '../base-player.types';
import metadata from './metadata.json';

export class Plyr extends BasePlayer {
  constructor() {
    super(metadata);
  }

  static getMetadata(): Metadata {
    return metadata;
  }

  getVideoContainer(): HTMLElement | null {
    return super.getContainerHelper(
      this.metadata.selectorStrings.default.videoContainerSelectorString
    );
  }

  getVideoControlsContainer(): HTMLElement | null {
    return super.getContainerHelper(
      this.metadata.selectorStrings.default.videoControlsContainerSelectorString
    );
  }

  getSettingsButtonElement(): HTMLElement | null {
    return super.getContainerHelper(
      this.metadata.selectorStrings.default
        .injectMenusButtonsReferenceNodeSelectorString
    );
  }

  initialise(): void {
    super.initialise();

    // AniMixPlay player already has frame scrubbing.
    const domainName = getDomainName(window.location.hostname);

    if (domainName !== 'vvid') {
      return;
    }

    window.removeEventListener('keydown', this.keyboardEventHandler);

    this.keyboardEventHandler = (): void => {};
    this.injectPlayerControlKeybinds();

    this.store.dispatch(playerControlsListenerTypeUpdated('keyup'));
  }
}
