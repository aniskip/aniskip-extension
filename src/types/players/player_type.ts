interface Player {
  document: Document;

  getSettingsContainer(): Element;
  getVideoContainer(): HTMLElement;
  injectSettingsButton(settingsButton: React.FC): void;
}

export default Player;
