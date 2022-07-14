import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { browser } from 'webextension-polyfill-ts';
import { debounce } from 'lodash';
import { HiOutlineExclamationCircle, HiSearch } from 'react-icons/hi';
import {
  animeTitleLanguageUpdated,
  keybindsUpdated,
  malIdUpdated,
  overlayClosed,
  overlayOpened,
  selectAnimeTitleLanguage,
  selectIsOverlayOpen,
  selectKeybinds,
  selectMalId,
} from '../../data';
import {
  DEFAULT_KEYBINDS,
  DEFAULT_SYNC_OPTIONS,
  Message,
  SyncOptions,
} from '../../scripts/background';
import {
  serialiseKeybind,
  useDispatch,
  usePageRef,
  useSelector,
  useShadowRootEvent,
  useShadowRootRef,
  useWindowEvent,
} from '../../utils';
import { SearchResult } from './AnimeCorrectionOverlay.types';
import { Keyboard } from '../Keyboard';
import { AnilistHttpClient, MEDIA_FORMAT_NAMES } from '../../api';

export function AnimeCorrectionOverlay(): JSX.Element {
  const [query, setQuery] = useState('');
  const [isResultsLoaded, setResultsLoaded] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [detectedAnime, setDetectedAnime] = useState<SearchResult>();
  const anilistHttpClient = useRef<AnilistHttpClient>(new AnilistHttpClient());
  const animeCorrectionPanelRef = useRef<HTMLDivElement>(null);
  const detectedMalId = useSelector(selectMalId);
  const animeTitleLanguage = useSelector(selectAnimeTitleLanguage);
  const keybinds = useSelector(selectKeybinds);
  const isOpen = useSelector(selectIsOverlayOpen);
  const shadowRoot = useShadowRootRef();
  const page = usePageRef();
  const dispatch = useDispatch();

  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  /**
   * Closes the dialog.
   */
  const onClose = (): void => {
    dispatch(overlayClosed());
  };

  /**
   * State reset after close transition.
   */
  const afterCloseTransition = (): void => {
    setQuery('');
    setSearchResults([]);
  };

  /**
   * Update skip times with manually selected anime.
   */
  const onChangeAnimeDetected = async (malId: number): Promise<void> => {
    dispatch(malIdUpdated(malId));
    page.storeManualTitleToMalIdMapping(malId);
    await browser.runtime.sendMessage({
      type: 'initialise-skip-times',
    } as Message);

    onClose();
  };

  /**
   * Populate search results.
   *
   * @param event Keyboard event to handle.
   */
  const onChangeInput = debounce(
    async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const title = event.target.value;
      setQuery(title);
      setResultsLoaded(false);

      const searchResponse =
        await anilistHttpClient.current.searchTitleCoverImages(title);

      const results = searchResponse.data.Page.media
        .filter((searchResult) => searchResult.idMal)
        .map(
          (searchResult) =>
            ({
              malId: searchResult.idMal,
              title:
                searchResult.title[animeTitleLanguage] ||
                searchResult.title.romaji,
              format: searchResult.format,
              seasonYear: searchResult.seasonYear,
              coverImage: searchResult.coverImage.medium,
            } as SearchResult)
        );

      setSearchResults(results);
      setResultsLoaded(true);
    },
    500
  );

  /**
   * Open the modal if the shortcut was pressed.
   */
  useWindowEvent('keydown', (event: KeyboardEvent): void => {
    if (serialiseKeybind(event) === keybinds['open-anime-search-overlay']) {
      dispatch(overlayOpened());
    }

    if (event.key === 'Escape') {
      onClose();
    }
  });

  /**
   * Close the modal if the overlay was clicked.
   */
  useShadowRootEvent(shadowRoot, 'mousedown', (event: Event): void => {
    const target = event.target as HTMLElement;

    if (!animeCorrectionPanelRef.current?.contains(target)) {
      onClose();
    }
  });

  /**
   * Sync user options.
   */
  useEffect(() => {
    (async (): Promise<void> => {
      // Retrieve user options.
      const syncOptions = (await browser.storage.sync.get({
        keybinds: DEFAULT_KEYBINDS,
        animeTitleLanguage: DEFAULT_SYNC_OPTIONS.animeTitleLanguage,
      })) as SyncOptions;

      dispatch(keybindsUpdated(syncOptions.keybinds));
      dispatch(animeTitleLanguageUpdated(syncOptions.animeTitleLanguage));
    })();
  }, []);

  /**
   * Search for detected anime cover image.
   */
  useEffect(() => {
    (async (): Promise<void> => {
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
        title: media.title[animeTitleLanguage] || media.title.romaji,
      };

      setDetectedAnime(searchResult);
    })();
  }, [detectedMalId, animeTitleLanguage, isOpen]);

  return (
    <Transition.Root show={isOpen} as={Fragment} appear>
      <div
        className="relative z-[9999] font-sans"
        role="dialog"
        aria-modal="true"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={afterCloseTransition}
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
              ref={animeCorrectionPanelRef}
            >
              <Combobox value={0} onChange={onChangeAnimeDetected}>
                <div className="relative">
                  <HiSearch
                    className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pr-11 pl-11 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Search anime..."
                    onChange={onChangeInput}
                  />
                  <Keyboard
                    as="button"
                    className="absolute top-3.5 right-4 hover:border-gray-300 hover:shadow-md active:border-gray-400"
                    type="button"
                    onClick={onClose}
                  >
                    Escape
                  </Keyboard>
                </div>
                {query === '' &&
                  searchResults.length === 0 &&
                  (detectedAnime ? (
                    <div className="overflow-y-auto p-3">
                      <h2 className="px-3 text-xs font-semibold text-gray-900">
                        Detected anime
                      </h2>
                      <div className="flex cursor-default select-none rounded-xl p-3">
                        <img
                          className="w-16 rounded-md object-cover"
                          src={detectedAnime.coverImage}
                          alt={`${detectedAnime.title} cover`}
                        />
                        <div className="ml-4 flex-auto overflow-auto">
                          <p className="truncate text-sm font-medium text-gray-700">
                            {detectedAnime.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {detectedAnime.seasonYear}{' '}
                            {MEDIA_FORMAT_NAMES[detectedAnime.format]}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-14 px-6 text-center text-sm sm:px-14">
                      <HiOutlineExclamationCircle
                        type="outline"
                        name="exclamation-circle"
                        className="mx-auto h-6 w-6 text-gray-400"
                      />
                      <p className="mt-4 font-semibold text-gray-900">
                        No anime detected
                      </p>
                      <p className="mt-2 text-gray-500">
                        Use the search bar to manually select the anime.
                      </p>
                    </div>
                  ))}
                {searchResults.length > 0 && (
                  <Combobox.Options
                    static
                    className="max-h-96 scroll-py-3 overflow-y-auto p-3"
                  >
                    {searchResults.map((searchResult) => (
                      <Combobox.Option
                        key={searchResult.malId}
                        value={searchResult.malId}
                        className={({ active }): string =>
                          `flex cursor-default select-none rounded-xl p-3 ${
                            active ? 'bg-amber-100' : ''
                          }`
                        }
                      >
                        {({ active }): JSX.Element => (
                          <>
                            <img
                              className="w-16 rounded-md object-cover"
                              src={searchResult.coverImage}
                              alt={`${searchResult.title} cover`}
                            />
                            <div className="ml-4 flex-auto overflow-auto">
                              <p
                                className={`truncate text-sm font-medium ${
                                  active ? 'text-amber-900' : 'text-gray-700'
                                }`}
                              >
                                {searchResult.title}
                              </p>
                              <p
                                className={`text-sm ${
                                  active ? 'text-amber-700' : 'text-gray-500'
                                }`}
                              >
                                {searchResult.seasonYear}{' '}
                                {MEDIA_FORMAT_NAMES[searchResult.format]}
                              </p>
                            </div>
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
                {query !== '' && isResultsLoaded && searchResults.length === 0 && (
                  <div className="py-14 px-6 text-center text-sm sm:px-14">
                    <HiOutlineExclamationCircle
                      type="outline"
                      name="exclamation-circle"
                      className="mx-auto h-6 w-6 text-gray-400"
                    />
                    <p className="mt-4 font-semibold text-gray-900">
                      No anime found
                    </p>
                    <p className="mt-2 text-gray-500">
                      No anime found for this search term. Please try again.
                    </p>
                  </div>
                )}
              </Combobox>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition.Root>
  );
}
