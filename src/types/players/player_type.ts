interface Player {
  document: Document;
  submitButtonContainer: HTMLDivElement;

  getVideoContainer(): HTMLElement | null;
  injectSubmitButton(): void;
}

export default Player;
