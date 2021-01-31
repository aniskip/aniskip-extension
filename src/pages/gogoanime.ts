import { skipOpEd } from '../utils/on_page';
import GetResponseTypeFromSkipTimes from '../types/pages/skip_time_types';

function AniwatchSkipOpEd(
  OP: GetResponseTypeFromSkipTimes,
  ED: GetResponseTypeFromSkipTimes
) {
  const player: HTMLVideoElement | null = document.querySelector(
    '.jw-video.jw-reset'
  );
  if (player) return skipOpEd(OP, ED, player);
}

export = { AniwatchSkipOpEd };
