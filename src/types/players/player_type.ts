import { SubmitButtonContainerProps } from '../components/submit_types';

interface Player {
  document: Document;

  getVideoContainer(): HTMLElement | null;
  injectSettingsButton(
    submitButtonContainer: React.FC<SubmitButtonContainerProps>
  ): void;
}

export default Player;
