export type MessageType =
  | 'fetch'
  | 'get-episode-information'
  | 'player-add-preview-skip-time'
  | 'player-add-skip-time'
  | 'player-get-current-time'
  | 'player-get-duration'
  | 'player-play'
  | 'player-ready'
  | 'player-remove-skip-time'
  | 'player-set-current-time';

export interface Message {
  type: MessageType;
  payload?: any;
  uuid?: string;
}
