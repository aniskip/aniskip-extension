import { skipOpEd } from '../../utils/on_page';
import { GetResponseTypeFromSkipTimes } from '../../types/api/skip_time_types';

function AniwatchSkipOpEd(
  OP: GetResponseTypeFromSkipTimes,
  ED: GetResponseTypeFromSkipTimes
) {
  const player: HTMLVideoElement | null = document.querySelector('#player');
  if (player) return skipOpEd(OP, ED, player);
}

export default AniwatchSkipOpEd;
