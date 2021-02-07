import Player from '../types/players/player_type';

abstract class BasePlayer implements Player {
  document: Document;

  constructor(document: Document) {
    this.document = document;
  }

  abstract getSettingsContainer(): Element;

  abstract getVideoContainer(): HTMLElement;

  abstract injectSettingsButton(settingsButton: React.FC): void;

  getSettingsContainerHelper(selectorString: string): Element {
    const settingsContainer = this.document.getElementsByClassName(
      selectorString
    )[0];
    return settingsContainer;
  }

  getVideoContainerHelper(selectorString: string): HTMLElement {
    const videoContainer = this.document.getElementsByClassName(
      selectorString
    )[0];
    return videoContainer as HTMLElement;
  }
}

export default BasePlayer;
