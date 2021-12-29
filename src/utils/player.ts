import { createContext, useContext } from 'react';
import { Player } from '../players/base-player.types';

/**
 * Player context.
 */
const PlayerContext = createContext<Player | undefined>(undefined);
export const PlayerProvider = PlayerContext.Provider;

/**
 * Custom hook to return a reference to the player.
 */
export const usePlayerRef = (): Player | undefined => useContext(PlayerContext);
