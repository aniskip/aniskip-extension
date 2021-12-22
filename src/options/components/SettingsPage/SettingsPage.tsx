import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { browser } from 'webextension-polyfill-ts';
import { ColorResult } from 'react-color';
import { SkipType, SKIP_TYPES, SKIP_TYPE_NAMES } from '../../../api';
import { DefaultButton, Dropdown } from '../../../components';
import {
  DEFAULT_SKIP_INDICATOR_COLOURS,
  DEFAULT_SKIP_OPTIONS,
  LocalOptions,
  SkipIndicatorColours,
  SkipOptions,
  SkipOptionType,
} from '../../../scripts/background';
import {
  Dispatch,
  RootState,
  selectIsLoaded,
  selectSkipIndicatorColours,
  selectSkipOptions,
  setIsSettingsLoaded,
  setSkipIndicatorColour,
  setSkipIndicatorColours,
  setSkipOption,
  setSkipOptions,
} from '../../data';
import { ColourPicker } from '../ColourPicker';

export function SettingsPage(): JSX.Element {
  const [filteredSkipTypes, setFilteredSkipTypes] = useState<
    Exclude<SkipType, 'preview'>[]
  >([]);
  const skipOptions = useSelector<RootState, SkipOptions>(selectSkipOptions);
  const skipIndicatorColours = useSelector<RootState, SkipIndicatorColours>(
    selectSkipIndicatorColours
  );
  const isSettingsLoaded = useSelector<RootState, boolean>(selectIsLoaded);
  const dispatch = useDispatch<Dispatch>();

  const dropdownOptions = [
    {
      id: 'manual-skip',
      label: 'Manual skip',
    },
    {
      id: 'auto-skip',
      label: 'Auto skip',
    },
    {
      id: 'disabled',
      label: 'Disabled',
    },
  ];

  /**
   * Initialise filtered skip types and store skip options.
   */
  useEffect(() => {
    setFilteredSkipTypes(
      SKIP_TYPES.filter((skipType) => skipType !== 'preview') as Exclude<
        SkipType,
        'preview'
      >[]
    );

    (async (): Promise<void> => {
      const syncedSkipOptions = (
        await browser.storage.sync.get({ skipOptions: DEFAULT_SKIP_OPTIONS })
      ).skipOptions as SkipOptions;

      const localSkipIndicatorColours = (
        await browser.storage.local.get({
          skipIndicatorColours: DEFAULT_SKIP_INDICATOR_COLOURS,
        })
      ).skipIndicatorColours as SkipIndicatorColours;

      dispatch(setSkipOptions(syncedSkipOptions));
      dispatch(setSkipIndicatorColours(localSkipIndicatorColours));
      dispatch(setIsSettingsLoaded(true));
    })();
  }, []);

  /**
   * Sync skip options with sync browser storage.
   */
  useEffect(() => {
    if (isSettingsLoaded) {
      browser.storage.sync.set({ skipOptions });
    }
  }, [skipOptions, isSettingsLoaded]);

  /**
   * Sync skip indicator colours with local browser storage.
   */
  useEffect(() => {
    if (isSettingsLoaded) {
      browser.storage.local.set({ skipIndicatorColours });
    }
  }, [skipIndicatorColours, isSettingsLoaded]);

  /**
   * Clears the cache.
   */
  const onClickClearCache = (): void => {
    const cacheCleared: Partial<LocalOptions> = {
      rulesCache: {},
      malIdCache: {},
    };

    browser.storage.local.set(cacheCleared);
  };

  /**
   * Handles skip option changes.
   *
   * @param skipType Skip type to change the option of.
   */
  const onChangeSkipOption =
    (skipType: SkipType) =>
    (skipOption: SkipOptionType): void => {
      dispatch(setSkipOption({ type: skipType, option: skipOption }));
    };

  /**
   * Handles skip option changes.
   *
   * @param skipType Skip type to change the option of.
   */
  const onChangeCompleteSkipIndicatorColour =
    (skipType: Exclude<SkipType, 'preview'>) =>
    (colour: ColorResult): void => {
      dispatch(setSkipIndicatorColour({ type: skipType, colour: colour.hex }));
    };

  return (
    <div className="sm:border sm:rounded-md border-gray-300 px-8 py-8 sm:bg-white">
      <h1 className="text-lg text-gray-900 font-semibold mb-3">Skip options</h1>
      <div className="space-y-3 w-full mb-6">
        {filteredSkipTypes.map((skipType) => (
          <div className="space-y-1">
            <div className="text-xs text-gray-700 uppercase font-semibold">
              {SKIP_TYPE_NAMES[skipType]}
            </div>
            <div className="flex justify-between items-center space-x-3">
              <Dropdown
                className="text-sm grow"
                value={skipOptions[skipType]!}
                onChange={onChangeSkipOption(skipType)}
                options={dropdownOptions}
              />
              <ColourPicker
                colour={skipIndicatorColours[skipType]}
                onChangeComplete={onChangeCompleteSkipIndicatorColour(skipType)}
              />
            </div>
          </div>
        ))}
      </div>
      <hr className="mb-6" />
      <h1 className="text-lg text-gray-900 font-semibold mb-3">
        Miscellaneous options
      </h1>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-700 uppercase font-semibold">
            Cache
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Are skip times incorrectly mapped? This will remove any cached
          anime-relations rules and cached anime title to MAL id mapping.
        </div>
      </div>
      <DefaultButton
        className="sm:w-auto w-full bg-primary border border-gray-300 text-white font-medium mt-4"
        onClick={onClickClearCache}
      >
        Clear cache
      </DefaultButton>
    </div>
  );
}
