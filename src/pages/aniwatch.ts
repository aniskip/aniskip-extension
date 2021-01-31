import SkipTimesType from '../types/pages/skip_time_types';

function skips(OP: SkipTimesType, ED: SkipTimesType) {
  const player: HTMLVideoElement | null = document.querySelector('#player');
  if (player != null) {
    const margin = 0.3;
    const currentTotalLength = player.duration;
    const opDiff = currentTotalLength - OP.episode_length;
    const edDiff = currentTotalLength - ED.episode_length;
    const opSkipper = setInterval(() => {
      if (OP.start_time > margin) {
        if (
          player.currentTime >= OP.start_time + opDiff + margin &&
          player.currentTime <= OP.end_time + opDiff - margin
        ) {
          player.currentTime = OP.end_time + opDiff - margin;
          clearInterval(opSkipper);
        }
      } else if (
        player.currentTime >= 0 &&
        player.currentTime <= OP.end_time + opDiff - margin
      ) {
        player.currentTime = OP.end_time + opDiff - margin;
        clearInterval(opSkipper);
      }
    }, margin * 1000);
    const edSkipper = setInterval(() => {
      if (
        player.currentTime >= ED.start_time + edDiff + margin &&
        player.currentTime <= ED.end_time + edDiff - margin
      ) {
        player.currentTime = ED.end_time + edDiff - margin;
        clearInterval(edSkipper);
      }
    }, margin * 1000);
  }
}

export = { skips };
