import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { ColorResult } from 'react-color';
import debounce from 'lodash.debounce';
import { DebouncedFunc } from 'lodash.debounce/node_modules/@types/lodash';
import { SkipType, SKIP_TYPES, SKIP_TYPE_NAMES } from '../../../api';
import { DefaultButton, Dropdown, Input, Keyboard } from '../../../components';
import {
  DEFAULT_KEYBINDS,
  DEFAULT_SKIP_OPTIONS,
  DEFAULT_SKIP_TIME_INDICATOR_COLOURS,
  KEYBIND_NAMES,
  KeybindType,
  LocalOptions,
  SkipOptionType,
} from '../../../scripts/background';
import {
  selectIsLoaded,
  selectSkipTimeIndicatorColours,
  selectSkipOptions,
  setIsSettingsLoaded,
  setSkipTimeIndicatorColour,
  setSkipTimeIndicatorColours,
  setSkipOption,
  setSkipOptions,
  setKeybinds,
  selectKeybinds,
  setKeybind,
} from '../../../data';
import { ColourPicker } from '../ColourPicker';
import { useDispatch, useSelector } from '../../../hooks';
import { serialiseKeybind } from '../../../utils/keybinds';

export function SettingsPage(): JSX.Element {
  const [filteredSkipTypes, setFilteredSkipTypes] = useState<
    Exclude<SkipType, 'preview'>[]
  >([]);
  const skipOptions = useSelector(selectSkipOptions);
  const skipTimeIndicatorColours = useSelector(selectSkipTimeIndicatorColours);
  const keybinds = useSelector(selectKeybinds);
  const isSettingsLoaded = useSelector(selectIsLoaded);
  const dispatch = useDispatch();

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
      const {
        skipOptions: syncedSkipOptions,
        skipTimeIndicatorColours: syncedSkipTimeIndicatorColours,
        keybinds: syncedKeybinds,
      } = await browser.storage.sync.get({
        skipOptions: DEFAULT_SKIP_OPTIONS,
        skipTimeIndicatorColours: DEFAULT_SKIP_TIME_INDICATOR_COLOURS,
        keybinds: DEFAULT_KEYBINDS,
      });

      dispatch(setSkipOptions(syncedSkipOptions));
      dispatch(setSkipTimeIndicatorColours(syncedSkipTimeIndicatorColours));
      dispatch(setKeybinds(syncedKeybinds));
      dispatch(setIsSettingsLoaded(true));
    })();
  }, []);

  /**
   * Sync options with sync browser storage.
   */
  useEffect(() => {
    if (isSettingsLoaded) {
      browser.storage.sync.set({ skipOptions });
      browser.storage.sync.set({ skipTimeIndicatorColours });
    }
  }, [skipOptions, skipTimeIndicatorColours, isSettingsLoaded]);

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
   * Sync options with sync browser storage.
   */
  useEffect(() => {
    if (isSettingsLoaded) {
      browser.storage.sync.set({ skipOptions });
      browser.storage.sync.set({ skipTimeIndicatorColours });
      browser.storage.sync.set({ keybinds });
    }
  }, [skipOptions, skipTimeIndicatorColours, keybinds, isSettingsLoaded]);

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
  const onChangeCompleteSkipTimeIndicatorColour =
    (skipType: Exclude<SkipType, 'preview'>) =>
    (colour: ColorResult): void => {
      dispatch(
        setSkipTimeIndicatorColour({ type: skipType, colour: colour.hex })
      );
    };

  const onChangeCompleteKeybind = (
    keybindType: KeybindType
  ): DebouncedFunc<React.KeyboardEventHandler<HTMLInputElement>> =>
    debounce(
      (event: React.KeyboardEvent<HTMLInputElement>): void => {
        dispatch(
          setKeybind({
            type: keybindType,
            keybind: serialiseKeybind(
              event.ctrlKey,
              event.altKey,
              event.shiftKey,
              event.key
            ),
          })
        );
      },
      500,
      { leading: false, trailing: true }
    );

  return (
    <div className="sm:border sm:rounded-md border-gray-300 px-8 py-8 sm:bg-white">
      <h2 className="text-lg text-gray-900 font-semibold mb-3">Skip options</h2>
      <div className="space-y-3 mb-6">
        {filteredSkipTypes.map((skipType) => (
          <div className="space-y-1" key={skipType}>
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
                colour={skipTimeIndicatorColours[skipType]}
                onChangeComplete={onChangeCompleteSkipTimeIndicatorColour(
                  skipType
                )}
              />
            </div>
          </div>
        ))}
      </div>
      <hr className="mb-6" />
      <h2 className="text-lg text-gray-900 font-semibold mb-3">Keybinds</h2>
      <div className="space-y-3 mb-6">
        {Object.entries(keybinds).map(([type, keybind]) => (
          <div className="space-y-1" key={type}>
            <span className="text-xs text-gray-700 uppercase font-semibold">
              {KEYBIND_NAMES[type as KeybindType]}
            </span>
            <div className="flex justify-between items-center space-x-3">
              <Input
                className="text-sm select-none w-full uppercase focus:ring-1 focus:ring-primary focus:border-primary"
                type="text"
                spellCheck="false"
                onKeyDown={onChangeCompleteKeybind(type as KeybindType)}
                value={keybind}
                readOnly
              />
              <span className="flex items-center">
                {keybind
                  .split('+')
                  .map((key, index) =>
                    ([index ? '+' : ''] as (JSX.Element | string)[]).concat([
                      <Keyboard key={`${type}-${key}`}>{key}</Keyboard>,
                    ])
                  )}
              </span>
            </div>
          </div>
        ))}
      </div>
      <hr className="mb-6" />
      <h2 className="text-lg text-gray-900 font-semibold mb-3">
        Miscellaneous options
      </h2>
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
