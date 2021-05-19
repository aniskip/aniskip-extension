export type MessageType =
  | 'fetch'
  | 'fetch-response'
  | 'get-episode-information'
  | 'get-episode-information-response'
  | 'player-add-preview-skip-time'
  | 'player-add-skip-time'
  | 'player-get-current-time'
  | 'player-get-current-time-response'
  | 'player-get-duration'
  | 'player-get-duration-response'
  | 'player-play'
  | 'player-ready'
  | 'player-remove-skip-time'
  | 'player-set-current-time';

export interface Message {
  type: MessageType;
  payload?: any;
}
