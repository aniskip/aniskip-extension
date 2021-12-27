import React, { useEffect, useRef, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { debounce } from 'lodash';
import { BiSearch } from 'react-icons/bi';
import { AnilistHttpClient, MEDIA_FORMAT_NAMES } from '../../api';
import {
  useShadowRootRef,
  useWindowEvent,
  useShadowRootEvent,
  usePageRef,
} from '../../utils';
import { AnimeSearchModalProps, SearchResult } from './AnimeSearchModal.types';
import { Message } from '../../scripts/background';
import { useDispatch, useSelector } from '../../hooks';
import {
  selectIsInitialOverlayOpen,
  selectMalId,
  setIsInitialOverlayOpen,
  setMalId,
} from '../../data';
import { Keyboard } from '../Keyboard';

export function AnimeSearchModal({
  onClose,
}: AnimeSearchModalProps): JSX.Element {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [animeDetected, setAnimeDetected] = useState<SearchResult>();
  const anilistHttpClient = useRef<AnilistHttpClient>(new AnilistHttpClient());
  const animeSearchModalRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const isInitialOverlayOpen = useSelector(selectIsInitialOverlayOpen);
  const detectedMalId = useSelector(selectMalId);
  const shadowRoot = useShadowRootRef();
  const page = usePageRef();
  const dispatch = useDispatch();

  /**
   * Handles search bar input change.
   */
  const onChangeSearchBar = debounce(
    async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const title = event.target.value;

      const searchResponse =
        await anilistHttpClient.current.searchTitleCoverImages(title);

      const results = searchResponse.data.Page.media
        .filter(
          (searchResult) => searchResult.idMal && searchResult.title.english
        )
        .map(
          (searchResult) =>
            ({
              malId: searchResult.idMal,
              title: searchResult.title.english,
              format: searchResult.format,
              seasonYear: searchResult.seasonYear,
              coverImage: searchResult.coverImage.medium,
            } as SearchResult)
        );

      setSearchResults(results);

      dispatch(setIsInitialOverlayOpen(false));
    },
    500
  );

  /**
   * Sends the selected anime MAL id to the player script.
   *
   * @param malId MAL id to send.
   */
  const onClickAnimeOption = (malId: number) => (): void => {
    if (!onClose) {
      return;
    }

    dispatch(setMalId(malId));
    page?.storeManualTitleToMalIdMapping(malId);

    browser.runtime.sendMessage({ type: 'initialise-skip-times' } as Message);

    onClose();
  };

  /**
   * Sends the selected anime MAL id to the player script.
   *
   * @param malId MAL id to send.
   */
  const onKeyDownAnimeOption =
    (malId: number) =>
    (event: React.KeyboardEvent<HTMLLIElement>): void => {
      if (event.key !== 'Enter' || !onClose) {
        return;
      }

      dispatch(setMalId(malId));
      page?.storeManualTitleToMalIdMapping(malId);

      browser.runtime.sendMessage({ type: 'initialise-skip-times' } as Message);

      onClose();
    };

  /**
   * Close the modal if the overlay was clicked.
   */
  useShadowRootEvent(shadowRoot!, 'mousedown', (event: Event): void => {
    const target = event.target as HTMLElement;

    if (animeSearchModalRef.current?.contains(target) || !onClose) {
      return;
    }

    onClose();
  });

  /**
   * Close the modal if the escape key was pressed.
   */
  useWindowEvent('keydown', (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !onClose) {
      return;
    }

    onClose();
  });

  /**
   * Focus the search bar and display the detected episode on first open.
   */
  useEffect(() => {
    searchBarRef.current?.focus();

    (async (): Promise<void> => {
      dispatch(setIsInitialOverlayOpen(true));

      if (detectedMalId === 0) {
        return;
      }

      const searchResponse = await anilistHttpClient.current?.searchCoverImage(
        detectedMalId
      );
      const media = searchResponse.data.Media;

      const searchResult: SearchResult = {
        coverImage: media.coverImage.medium,
        format: media.format,
        seasonYear: media.seasonYear,
        malId: media.idMal,
        title: media.title.english,
      };

      setAnimeDetected(searchResult);
    })();
  }, []);

  return (
    <div
      role="dialog"
      ref={animeSearchModalRef}
      className="flex flex-col bg-neutral-50 rounded-md font-sans shadow-md max-w-2xl max-h-full sm:mx-auto"
    >
      <div className="flex items-center px-4">
        <BiSearch className="w-5 h-5" />
        <div className="px-4 flex-auto">
          <input
            ref={searchBarRef}
            className="h-14 w-full bg-inherit focus:outline-none"
            placeholder="Search anime"
            onChange={onChangeSearchBar}
          />
        </div>
        <Keyboard
          as="button"
          className="hover:shadow-md hover:border-gray-300 active:border-gray-400 "
          type="button"
          onClick={onClose}
        >
          Esc
        </Keyboard>
      </div>
      <hr />
      {isInitialOverlayOpen &&
        (animeDetected ? (
          <div className="flex flex-col space-y-4 overflow-y-auto px-4 py-6">
            <span className="font-semibold">Anime detected</span>
            <div className="flex space-x-2 bg-gray-100 rounded-md p-4">
              <img
                className="object-cover rounded-md w-16"
                src={animeDetected.coverImage}
                alt={`${animeDetected.title} cover`}
              />
              <div className="flex flex-col justify-center overflow-auto">
                <span className="font-bold truncate">
                  {animeDetected.title}
                </span>
                <span className="font-semibold text-sm text-gray-500">
                  {animeDetected.seasonYear}{' '}
                  {MEDIA_FORMAT_NAMES[animeDetected.format]}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-20">
            <span className="text-lg text-gray-400">No anime detected</span>
          </div>
        ))}
      {!isInitialOverlayOpen &&
        (searchResults.length === 0 ? (
          <div className="flex items-center justify-center p-20">
            <span className="text-lg text-gray-400">No search results</span>
          </div>
        ) : (
          <div className="px-4 py-6 overflow-y-auto">
            <div className="pb-4">
              <span className="font-semibold">Search results</span>
            </div>
            <ul className="flex flex-col space-y-2" role="listbox">
              {searchResults.map((searchResult) => (
                <li
                  tabIndex={0}
                  role="option"
                  aria-selected="false"
                  className="group flex space-x-2 bg-gray-100 rounded-md p-4 hover:bg-amber-100"
                  key={searchResult.malId}
                  onClick={onClickAnimeOption(searchResult.malId)}
                  onKeyDown={onKeyDownAnimeOption(searchResult.malId)}
                >
                  <img
                    className="object-cover rounded-md w-16"
                    src={searchResult.coverImage}
                    alt={`${searchResult.title} cover`}
                  />
                  <div className="flex flex-col justify-center overflow-auto">
                    <span className="font-bold truncate group-hover:text-amber-900">
                      {searchResult.title}
                    </span>
                    <span className="font-semibold text-sm text-gray-500 group-hover:text-amber-900">
                      {searchResult.seasonYear}{' '}
                      {MEDIA_FORMAT_NAMES[searchResult.format]}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
