import React, { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPlay, FaTimes } from 'react-icons/fa';
import { browser } from 'webextension-polyfill-ts';
import {
  AniskipHttpClient,
  SkipTime,
  SKIP_TYPE_NAMES,
  VoteType,
} from '../../api';
import {
  secondsToTimeString,
  usePlayerRef,
  useDispatch,
  useSelector,
} from '../../utils';
import { LinkButton } from '../LinkButton';
import {
  submitMenuVisibilityUpdated,
  voteMenuVisibilityUpdated,
  skipTimeRemoved,
  selectIsVoteMenuVisible,
  selectSkipTimes,
} from '../../data';

export function VoteMenu(): JSX.Element {
  const aniskipHttpClientRef = useRef<AniskipHttpClient>(
    new AniskipHttpClient()
  );
  const [skipTimesVoted, setSkipTimesVoted] = useState<
    Record<string, VoteType>
  >({});
  const [sortedSkipTimes, setSortedSkipTimes] = useState<SkipTime[]>([]);
  const [playerDuration, setPlayerDuration] = useState(0);
  const visible = useSelector(selectIsVoteMenuVisible);
  const skipTimes = useSelector(selectSkipTimes);
  const dispatch = useDispatch();
  const player = usePlayerRef();

  /**
   * Initialise filtered skip times and voted skip times.
   */
  useEffect(() => {
    setSortedSkipTimes(
      [...skipTimes].sort((a, b) => a.interval.startTime - b.interval.endTime)
    );

    const duration = player?.getDuration() ?? 0;
    setPlayerDuration(duration);

    (async (): Promise<void> => {
      const currentSkipTimesVoted = (
        await browser.storage.local.get({ skipTimesVoted: {} })
      ).skipTimesVoted;

      setSkipTimesVoted(currentSkipTimesVoted);
    })();
  }, [skipTimes]);

  const setPlayerCurrentTime = (time: number) => (): void => {
    player?.setCurrentTime(time);
    player?.play();
  };

  /**
   * Closes the vote menu.
   */
  const onClickCloseButton = (): void => {
    dispatch(voteMenuVisibilityUpdated(false));
  };

  /**
   * Closes the vote menu and opens the submit menu.
   */
  const onClickSubmitLink = (): void => {
    dispatch(voteMenuVisibilityUpdated(false));
    dispatch(submitMenuVisibilityUpdated(true));
  };

  /**
   * Upvotes the input skip time.
   *
   * @param isUpvoted Is the current skip time upvoted.
   * @param skipId Skip ID to upvote.
   */
  const onClickUpvote =
    (isUpvoted: boolean, skipId: string) => async (): Promise<void> => {
      if (isUpvoted) {
        return;
      }

      const { skipTimesVoted: currentSkipTimesVoted } =
        await browser.storage.local.get({ skipTimesVoted: {} });

      const updatedSkipTimesVoted = {
        ...skipTimesVoted,
        ...currentSkipTimesVoted,
        [skipId]: 'upvote',
      };

      setSkipTimesVoted(updatedSkipTimesVoted);
      browser.storage.local.set({
        skipTimesVoted: updatedSkipTimesVoted,
      });

      await aniskipHttpClientRef.current.upvote(skipId);
    };

  /**
   * Downvotes the input skip time.
   *
   * @param isDownvoted Is the current skip time downvoted.
   * @param skipId Skip ID to downbote.
   */
  const onClickDownvote =
    (isDownvoted: boolean, skipId: string) => async (): Promise<void> => {
      if (isDownvoted) {
        return;
      }

      const { skipTimesVoted: currentSkipTimesVoted } =
        await browser.storage.local.get({ skipTimesVoted: {} });

      const updatedSkipTimesVoted = {
        ...skipTimesVoted,
        ...currentSkipTimesVoted,
        [skipId]: 'downvote',
      };

      dispatch(skipTimeRemoved(skipId));

      setSkipTimesVoted(updatedSkipTimesVoted);
      browser.storage.local.set({
        skipTimesVoted: updatedSkipTimesVoted,
      });

      await aniskipHttpClientRef.current.downvote(skipId);
    };

  return (
    <div
      className={`pointer-events-none z-10 w-60 select-none rounded-md border border-gray-300 bg-neutral-800 bg-opacity-80 px-5 py-2 font-sans text-sm text-white opacity-0 backdrop-blur-md transition-opacity md:text-base ${
        visible ? 'sm:pointer-events-auto sm:opacity-100' : ''
      }`}
    >
      <div className="mb-2 flex h-auto w-full items-center justify-between">
        <div className="flex items-center space-x-1 outline-none">
          <FaPlay className="text-primary" size={12} />
          <span className="text-sm font-bold uppercase">Vote skip times</span>
        </div>
        <button
          type="button"
          className="flex items-center justify-center focus:outline-none"
          onClick={onClickCloseButton}
        >
          <FaTimes className="h-4 w-4 active:text-primary" />
        </button>
      </div>
      <div className="divide-y divide-gray-300">
        {sortedSkipTimes.length === 0 && (
          <div className="mt-4 space-y-1 text-xs">
            <div className="font-semibold uppercase text-gray-200">
              No skip times found
            </div>
            <LinkButton
              className="font-bold uppercase text-blue-500 hover:no-underline"
              onClick={onClickSubmitLink}
            >
              Submit here
            </LinkButton>
          </div>
        )}
        {sortedSkipTimes.length > 0 &&
          sortedSkipTimes.map((skipTime) => {
            const { skipId, interval, skipType, episodeLength } = skipTime;
            const offset = playerDuration - episodeLength;
            const isUpvoted = skipTimesVoted[skipId] === 'upvote';
            const isDownvoted = skipTimesVoted[skipId] === 'downvote';
            const startTimeFormatted = secondsToTimeString(
              interval.startTime + offset,
              0
            );
            const endTimeFormatted = secondsToTimeString(
              interval.endTime + offset,
              0
            );

            return (
              <div
                className="flex justify-between py-2"
                key={`vote-menu-skip-time-${skipId}`}
              >
                <div className="flex flex-col justify-between">
                  <span className="text-xs font-bold uppercase">
                    {SKIP_TYPE_NAMES[skipType]}
                  </span>
                  <span className="text-sm text-blue-500">
                    <LinkButton
                      onClick={setPlayerCurrentTime(
                        // Ensure that it won't be auto-skipped.
                        interval.startTime + offset + 0.01
                      )}
                    >
                      {startTimeFormatted}
                    </LinkButton>{' '}
                    <span className="text-white">-</span>{' '}
                    <LinkButton
                      onClick={setPlayerCurrentTime(interval.endTime + offset)}
                    >
                      {endTimeFormatted}
                    </LinkButton>
                  </span>
                </div>
                <div className="flex flex-col justify-between">
                  <button
                    className={`hover:text-primary focus:outline-none active:opacity-80 ${
                      isUpvoted && 'text-primary'
                    }`}
                    type="button"
                    onClick={onClickUpvote(isUpvoted, skipId)}
                    disabled={isUpvoted}
                  >
                    <FaChevronUp />
                  </button>
                  <button
                    className={`hover:text-blue-500 focus:outline-none active:opacity-80 ${
                      isDownvoted && 'text-blue-500'
                    }`}
                    type="button"
                    onClick={onClickDownvote(isDownvoted, skipId)}
                    disabled={isDownvoted}
                  >
                    <FaChevronDown />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
