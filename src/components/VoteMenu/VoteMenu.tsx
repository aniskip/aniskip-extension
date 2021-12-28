import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPlay, FaTimes } from 'react-icons/fa';
import { browser } from 'webextension-polyfill-ts';
import { useAniskipHttpClient, useDispatch, useSelector } from '../../hooks';
import { SkipTime, SKIP_TYPE_NAMES, VoteType } from '../../api';
import { secondsToTimeString, usePlayerRef } from '../../utils';
import { LinkButton } from '../LinkButton';
import {
  changeSubmitMenuVisibility,
  changeVoteMenuVisibility,
  removeSkipTime,
  selectIsVoteMenuVisible,
  selectSkipTimes,
} from '../../data';

export function VoteMenu(): JSX.Element {
  const { aniskipHttpClient } = useAniskipHttpClient();
  const [skipTimesVoted, setSkipTimesVoted] = useState<
    Record<string, VoteType>
  >({});
  const [filteredSkipTimes, setFilteredSkipTimes] = useState<SkipTime[]>([]);
  const [playerDuration, setPlayerDuration] = useState(0);
  const visible = useSelector(selectIsVoteMenuVisible);
  const skipTimes = useSelector(selectSkipTimes);
  const dispatch = useDispatch();
  const player = usePlayerRef();

  /**
   * Initialise filtered skip times and voted skip times.
   */
  useEffect(() => {
    const sortedSkipTimes = [...skipTimes].sort(
      (a, b) => a.interval.startTime - b.interval.endTime
    );
    const sortedAndFilteredSkipTimes = [
      ...sortedSkipTimes.filter(({ skipType }) => skipType !== 'preview'),
    ];
    setFilteredSkipTimes(sortedAndFilteredSkipTimes);

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
    dispatch(changeVoteMenuVisibility(false));
  };

  /**
   * Closes the vote menu and opens the submit menu.
   */
  const onClickSubmitLink = (): void => {
    dispatch(changeVoteMenuVisibility(false));
    dispatch(changeSubmitMenuVisibility(true));
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

      await aniskipHttpClient.upvote(skipId);
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

      dispatch(removeSkipTime(skipId));

      setSkipTimesVoted(updatedSkipTimesVoted);
      browser.storage.local.set({
        skipTimesVoted: updatedSkipTimesVoted,
      });

      await aniskipHttpClient.downvote(skipId);
    };

  return (
    <div
      className={`text-sm md:text-base font-sans w-60 px-5 py-2 z-10 bg-neutral-800 bg-opacity-80 border border-gray-300 select-none rounded-md transition-opacity text-white opacity-0 pointer-events-none ${
        visible ? 'sm:opacity-100 sm:pointer-events-auto' : ''
      }`}
    >
      <div className="flex justify-between items-center w-full h-auto mb-2">
        <div className="flex items-center space-x-1 outline-none">
          <FaPlay className="text-primary" size={12} />
          <span className="font-bold text-sm uppercase">Vote skip times</span>
        </div>
        <button
          type="button"
          className="flex justify-center items-center focus:outline-none"
          onClick={onClickCloseButton}
        >
          <FaTimes className="w-4 h-4 active:text-primary" />
        </button>
      </div>
      <div className="divide-y divide-gray-300">
        {filteredSkipTimes.length === 0 && (
          <div className="text-xs space-y-1 mt-4">
            <div className="text-gray-200 uppercase font-semibold">
              No skip times found
            </div>
            <LinkButton
              className="text-blue-500 uppercase font-bold hover:no-underline"
              onClick={onClickSubmitLink}
            >
              Submit here
            </LinkButton>
          </div>
        )}
        {filteredSkipTimes.length > 0 &&
          filteredSkipTimes.map((skipTime) => {
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
                  <span className="font-bold uppercase text-xs">
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
                    className={`focus:outline-none hover:text-primary active:opacity-80 ${
                      isUpvoted && 'text-primary'
                    }`}
                    type="button"
                    onClick={onClickUpvote(isUpvoted, skipId)}
                    disabled={isUpvoted}
                  >
                    <FaChevronUp />
                  </button>
                  <button
                    className={`focus:outline-none hover:text-blue-500 active:opacity-80 ${
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
