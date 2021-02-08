import SettingsButtonProps from '../components/settings_button_types';

interface Player {
  document: Document;

  getVideoContainer(): HTMLElement | null;
  injectSettingsButton(settingsButton: React.FC<SettingsButtonProps>): void;
}

export default Player;
