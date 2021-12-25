import React, { useCallback, useRef, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import debounce from 'lodash.debounce';
import { AnilistHttpClient } from '../../api';
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

        const results = searchResponse.data.Page.media.map((searchResult) => ({
          malId: searchResult.idMal,
          title: searchResult.title.english,
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
      className="bg-neutral-50 rounded-md font-sans shadow-md max-w-2xl md:mx-auto"
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
    </div>
  );
}
