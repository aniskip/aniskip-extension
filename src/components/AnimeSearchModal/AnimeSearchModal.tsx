import React, { useCallback, useRef, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import debounce from 'lodash.debounce';
import { AnilistHttpClient, MEDIA_FORMAT_NAMES } from '../../api';
import {
  useShadowRootRef,
  useWindowEvent,
  useShadowRootEvent,
} from '../../utils';
import { AnimeSearchModalProps, SearchResult } from './AnimeSearchModal.types';

export function AnimeSearchModal({
  onClose,
}: AnimeSearchModalProps): JSX.Element {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const anilistHttpClient = useRef<AnilistHttpClient>(new AnilistHttpClient());
  const animeSearchModalRef = useRef<HTMLDivElement>(null);
  const shadowRoot = useShadowRootRef();

  /**
   * Handles search bar input change.
   */
  const onChangeSearchBar = useCallback(
    debounce(
      async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const title = event.target.value;

        const searchResponse =
          await anilistHttpClient.current.searchTitleCoverImages(title);

        const results = searchResponse.data.Page.media
          .filter(
            (searchResult) => searchResult.idMal && searchResult.title.english
          )
          .map((searchResult) => ({
            malId: searchResult.idMal,
            title: searchResult.title.english,
            format: searchResult.format,
            seasonYear: searchResult.seasonYear,
            coverImage: searchResult.coverImage.medium,
          }));

        setSearchResults(results);
      },
      500
    ),
    []
  );

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

  return (
    <div
      role="dialog"
      ref={animeSearchModalRef}
      className="flex flex-col bg-neutral-50 rounded-md font-sans shadow-md max-w-2xl max-h-full md:mx-auto"
    >
      <div className="flex items-center px-4">
        <BiSearch className="w-5 h-5" />
        <div className="px-4 flex-auto">
          <input
            className="h-14 w-full bg-inherit focus:outline-none"
            placeholder="Search anime"
            onChange={onChangeSearchBar}
          />
        </div>
        <button
          className="font-semibold uppercase text-[0.625em] border border-gray-200 p-2 rounded-md hover:shadow-md hover:border-gray-300 active:border-gray-400"
          type="button"
          onClick={onClose}
        >
          Esc
        </button>
      </div>
      <hr />
      {searchResults.length === 0 ? (
        <div className="flex items-center justify-center p-20">
          <span className="text-lg text-gray-400">No search results</span>
        </div>
      ) : (
        <div className="flex flex-col space-y-2 overflow-y-auto px-4 py-6">
          {searchResults.map((searchResult) => (
            <div
              className="group flex space-x-2 bg-gray-100 rounded-md p-4 hover:bg-amber-100"
              key={searchResult.malId}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
