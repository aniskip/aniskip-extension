import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
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
  KEYBIND_INFO,
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
  selectIsUserEditingKeybind,
  setIsUserEditingKeybind,
} from '../../../data';
import { ColourPicker } from '../ColourPicker';
import { useDispatch, useSelector } from '../../../hooks';
import { serialiseKeybind } from '../../../utils';

export function SettingsPage(): JSX.Element {
  const [filteredSkipTypes, setFilteredSkipTypes] = useState<
    Exclude<SkipType, 'preview'>[]
  >([]);
  const skipOptions = useSelector(selectSkipOptions);
  const skipTimeIndicatorColours = useSelector(selectSkipTimeIndicatorColours);
  const keybinds = useSelector(selectKeybinds);
  const isUserEditingKeybind = useSelector(selectIsUserEditingKeybind);
  const isSettingsLoaded = useSelector(selectIsLoaded);
  const keybindInputRef = useRef<HTMLInputElement | null>(null);
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
  const onChangeCompleteSkipTimeIndicatorColour =
    (skipType: Exclude<SkipType, 'preview'>) =>
    (colour: ColorResult): void => {
      dispatch(
        setSkipTimeIndicatorColour({ type: skipType, colour: colour.hex })
      );
    };

  /**
   * Handles keybind changes.
   *
   * @param keybindType Keybind type to change.
   */
  const onChangeCompleteKeybind = (
    keybindType: KeybindType
  ): DebouncedFunc<React.KeyboardEventHandler<HTMLInputElement>> =>
    debounce(
      (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Escape') {
          dispatch(
            setKeybind({
              type: keybindType,
              keybind: '',
            })
          );

          return;
        }

        dispatch(
          setKeybind({
            type: keybindType,
            keybind: serialiseKeybind(event),
          })
        );
      },
      500,
      { leading: false, trailing: true }
    );

  /**
   * Handles user clicking on the edit keybind button.
   *
   * @param keybindType Type of keybind to edit.
   */
  const onClickEditKeybind = (keybindType: KeybindType) => (): void => {
    flushSync(() => {
      dispatch(
        setIsUserEditingKeybind({
          type: keybindType,
          isUserEditingKeybind: true,
        })
      );
    });

    keybindInputRef.current?.focus();
  };

  /**
   * Handles on blur event when user clicks off the keybind editor.
   *
   * @param keybindType Type of keybind being edited.
   */
  const onBlurKeybindEditor = (keybindType: KeybindType) => (): void => {
    dispatch(
      setIsUserEditingKeybind({
        type: keybindType,
        isUserEditingKeybind: false,
      })
    );
  };

  /**
   * Initialise filtered skip types, store skip options and keybinds.
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
      browser.storage.sync.set({ keybinds });
    }
  }, [skipOptions, skipTimeIndicatorColours, keybinds, isSettingsLoaded]);

  /**
   * Sync options with sync browser storage.
   */
  useEffect(() => {
    if (isSettingsLoaded) {
      browser.storage.sync.set({ skipOptions });
      browser.storage.sync.set({ skipTimeIndicatorColours });
    }
  }, [skipOptions, skipTimeIndicatorColours, isSettingsLoaded]);

  return (
    <div className="sm:border sm:rounded-md border-gray-300 px-8 py-8 sm:bg-white">
      <h2 className="text-xl text-gray-900 font-semibold mb-3">Skip options</h2>
      <div className="space-y-3 mb-12">
        {filteredSkipTypes.map((skipType) => (
          <div className="space-y-2" key={skipType}>
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
      <h2 className="text-xl text-gray-900 font-semibold mb-1">Keybinds</h2>
      <div className="space-y-3 mb-12 divide-y">
        {Object.entries(keybinds).map(([type, keybind]) => (
          <div className="space-y-2 pt-3" key={type}>
            <div className="flex justify-between items-center space-x-3 w-full focus:outline-none">
              <button
                className="text-base text-gray-700 font-semibold"
                type="button"
                disabled={isUserEditingKeybind[type as KeybindType]}
                onClick={onClickEditKeybind(type as KeybindType)}
              >
                {KEYBIND_NAMES[type as KeybindType]}
              </button>
              {!isUserEditingKeybind[type as KeybindType] ? (
                <button
                  className="flex items-center"
                  type="button"
                  disabled={isUserEditingKeybind[type as KeybindType]}
                  onClick={onClickEditKeybind(type as KeybindType)}
                >
                  {keybind &&
                    keybind
                      .split('+')
                      .map((key, index) =>
                        ([index ? '+' : ''] as (JSX.Element | string)[]).concat(
                          [<Keyboard key={`${type}-${key}`}>{key}</Keyboard>]
                        )
                      )}
                </button>
              ) : (
                <Input
                  ref={keybindInputRef}
                  className="text-xs select-none uppercase focus:ring-1 w-36 focus:ring-primary focus:border-primary"
                  type="text"
                  spellCheck="false"
                  onKeyDown={onChangeCompleteKeybind(type as KeybindType)}
                  onBlur={onBlurKeybindEditor(type as KeybindType)}
                  value={keybind}
                  readOnly
                />
              )}
            </div>
            {KEYBIND_INFO[type as KeybindType] && (
              <div className="text-sm text-gray-500">
                {KEYBIND_INFO[type as KeybindType]}
              </div>
            )}
          </div>
        ))}
      </div>
      <h2 className="text-xl text-gray-900 font-semibold mb-3">
        Miscellaneous options
      </h2>
      <div className="space-y-2">
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
