import SettingsButtonProps from '../types/components/settings_button_types';
import Player from '../types/players/player_type';

abstract class BasePlayer implements Player {
  document: Document;

  constructor(document: Document) {
    this.document = document;
  }

  abstract injectSettingsButton(
    settingsButton: React.FC<SettingsButtonProps>
  ): void;

  abstract getVideoContainer(): HTMLElement | null;

  getVideoContainerHelper(
    selectorString: string,
    index: number
  ): HTMLElement | null {
    const videoContainer = this.document.getElementsByClassName(selectorString);
    return videoContainer[index] as HTMLElement;
  }
}

export default BasePlayer;
