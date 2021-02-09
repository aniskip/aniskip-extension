interface Player {
  document: Document;

  getVideoContainer(): HTMLElement | null;
  injectSubmitButton(): void;
}

export default Player;
