import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { browser } from 'webextension-polyfill-ts';
import { SkipType, SKIP_TYPES, SKIP_TYPE_NAMES } from '../../../api';
import { DefaultButton, Dropdown } from '../../../components';
import {
  LocalOptions,
  SkipOptions,
  SkipOptionType,
} from '../../../scripts/background';
import {
  Dispatch,
  RootState,
  selectSkipOptions,
  setSkipOption,
  setSkipOptions,
} from '../../data';

export function SettingsPage(): JSX.Element {
  const [filteredSkipTypes, setFilteredSkipTypes] = useState<SkipType[]>([]);
  const skipOptions = useSelector<RootState, SkipOptions>(selectSkipOptions);
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
      SKIP_TYPES.filter((skipType) => skipType !== 'preview')
    );

    (async (): Promise<void> => {
      const { skipOptions: syncedSkipOptions } = await browser.storage.sync.get(
        'skipOptions'
      );

      dispatch(setSkipOptions(syncedSkipOptions));
    })();
  }, []);

  /**
   * Sync with browser storage.
   */
  useEffect(() => {
    browser.storage.sync.set({ skipOptions });
  }, [skipOptions]);

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
  const onChangeOption =
    (skipType: SkipType) =>
    (skipOption: SkipOptionType): void => {
      dispatch(setSkipOption({ type: skipType, option: skipOption }));
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
            <Dropdown
              className="text-sm w-full"
              value={skipOptions[skipType]!}
              onChange={onChangeOption(skipType)}
              options={dropdownOptions}
            />
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
