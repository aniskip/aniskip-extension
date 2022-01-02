import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { browser } from 'webextension-polyfill-ts';
import { ColorResult } from 'react-color';
import { debounce } from 'lodash';
import { sprintf } from 'sprintf-js';
import { SkipType, SKIP_TYPES, SKIP_TYPE_NAMES } from '../../../api';
import { DefaultButton, Dropdown, Input, Keyboard } from '../../../components';
import {
  ANIME_SEARCH_OVERLAY_KEYBIND_TYPES,
  DEFAULT_SYNC_OPTIONS,
  KEYBIND_INFO,
  KEYBIND_NAMES,
  KeybindType,
  LocalOptions,
  SUBMIT_MENU_KEYBIND_TYPES,
  SkipOptionType,
  SyncOptions,
  AnimeTitleLanguageType,
} from '../../../scripts/background';
import {
  selectSkipTimeIndicatorColours,
  selectSkipOptions,
  skipTimeIndicatorColourUpdated,
  skipTimeIndicatorColoursUpdated,
  skipOptionUpdated,
  skipOptionsUpdated,
  keybindsUpdated,
  selectKeybinds,
  keybindUpdated,
  selectIsUserEditingKeybind,
  isUserEditingKeybindUpdated,
  selectSkipTimeLength,
  selectChangeCurrentTimeLength,
  selectChangeCurrentTimeLargeLength,
  skipTimeLengthUpdated,
  changeCurrentTimeLengthUpdated,
  changeCurrentTimeLargeLengthUpdated,
  animeTitleLanguageUpdated,
  selectAnimeTitleLanguage,
} from '../../../data';
import { ColourPicker } from '../ColourPicker';
import { serialiseKeybind, useDispatch, useSelector } from '../../../utils';
import { Setting } from '../Setting';

export function SettingsPage(): JSX.Element {
  const [filteredSkipTypes, setFilteredSkipTypes] = useState<
    Exclude<SkipType, 'preview'>[]
  >([]);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState<boolean>(false);
  const skipOptions = useSelector(selectSkipOptions);
  const skipTimeIndicatorColours = useSelector(selectSkipTimeIndicatorColours);
  const keybinds = useSelector(selectKeybinds);
  const skipTimeLength = useSelector(selectSkipTimeLength);
  const changeCurrentTimeLength = useSelector(selectChangeCurrentTimeLength);
  const changeCurrentTimeLargeLength = useSelector(
    selectChangeCurrentTimeLargeLength
  );
  const animeTitleLanguage = useSelector(selectAnimeTitleLanguage);
  const isUserEditingKeybind = useSelector(selectIsUserEditingKeybind);
  const keybindInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const skipOptionDropdownOptions = [
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

  const animeTitleLanguageDropdownOptions = [
    {
      id: 'romaji',
      label: 'Romaji',
    },
    {
      id: 'english',
      label: 'English',
    },
    {
      id: 'native',
      label: 'Native',
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
      dispatch(skipOptionUpdated({ type: skipType, option: skipOption }));
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
        skipTimeIndicatorColourUpdated({ type: skipType, colour: colour.hex })
      );
    };

  /**
   * Handles keybind changes.
   *
   * @param keybindType Keybind type to change.
   */
  const onChangeCompleteKeybind = (
    keybindType: KeybindType
  ): ReturnType<typeof debounce> =>
    debounce(
      (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Escape') {
          dispatch(
            keybindUpdated({
              type: keybindType,
              keybind: '',
            })
          );

          return;
        }

        dispatch(
          keybindUpdated({
            type: keybindType,
            keybind: serialiseKeybind(event),
          })
        );
      },
      100,
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
        isUserEditingKeybindUpdated({
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
      isUserEditingKeybindUpdated({
        type: keybindType,
        isUserEditingKeybind: false,
      })
    );
  };

  /**
   * Formats keybind info strings.
   *
   * @param keybindType Type of kebind to get the formatted info of.
   */
  const formatKeybindInfo = (keybindType: KeybindType): string => {
    switch (keybindType) {
      case 'increase-current-time':
      case 'decrease-current-time':
        return sprintf(KEYBIND_INFO[keybindType], changeCurrentTimeLength);
      case 'increase-current-time-large':
      case 'decrease-current-time-large':
        return sprintf(KEYBIND_INFO[keybindType], changeCurrentTimeLargeLength);
      default:
      // no default
    }

    return KEYBIND_INFO[keybindType];
  };

  /**
   * Generic input handler for number inputs.
   *
   * @param action Action used to update state.
   */
  const onChangeNumericInput =
    (action: ActionCreatorWithPayload<number, string>) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      let number = parseFloat(event.target.value) || 0;

      if (number < 0) {
        number = 0;
      }

      dispatch(action(number));
    };

  /**
   * Handles changes to the anime title language.
   *
   * @param languageType Language type to set.
   */
  const onChangeAnimeTitleLanguage = (
    languageType: AnimeTitleLanguageType
  ): void => {
    dispatch(animeTitleLanguageUpdated(languageType));
  };

  /**
   * Renders a keybind. If no keybind is present, render an add keybind
   * button.
   *
   * @param keybind Keybind to render.
   * @param type Type of keybind to render.
   */
  const renderKeybind = (keybind: string, type?: KeybindType): JSX.Element => {
    if (!keybind) {
      return (
        <div className="px-4 py-2 border-transparent rounded text-sm bg-primary border border-gray-300 text-white font-medium focus:outline-none sm:w-auto w-full">
          Add keybind
        </div>
      );
    }

    return (
      <span className="flex items-center">
        {keybind
          .split('+')
          .map((key, index) =>
            ([index ? '+' : ''] as (JSX.Element | string)[]).concat([
              <Keyboard key={`${type}_${keybind}`}>{key}</Keyboard>,
            ])
          )}
      </span>
    );
  };

  /**
   * Renders a keybind setting.
   *
   * @param keybind Keybind to render
   * @param type Type of keybind to render
   */
  const renderKeybindSetting = (
    keybind: string,
    type: KeybindType
  ): JSX.Element => (
    <button
      key={type}
      className={`block w-full text-left ${
        isUserEditingKeybind[type as KeybindType]
          ? 'pointer-events-none'
          : 'pointer-events-auto'
      }`}
      type="button"
      onClick={onClickEditKeybind(type as KeybindType)}
    >
      <Setting
        className="pt-3"
        name={KEYBIND_NAMES[type as KeybindType]}
        description={formatKeybindInfo(type as KeybindType)}
      >
        {!isUserEditingKeybind[type as KeybindType] ? (
          renderKeybind(keybind, type as KeybindType)
        ) : (
          <Input
            ref={keybindInputRef}
            className="text-xs select-none uppercase focus:ring-1 w-36 focus:ring-primary focus:border-primary"
            type="text"
            spellCheck="false"
            onKeyDown={onChangeCompleteKeybind(type as KeybindType)}
            onBlur={onBlurKeybindEditor(type as KeybindType)}
            value={keybind}
            placeholder="Keybind"
            readOnly
          />
        )}
      </Setting>
    </button>
  );

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
      const syncOptions = (await browser.storage.sync.get(
        DEFAULT_SYNC_OPTIONS
      )) as SyncOptions;

      dispatch(skipOptionsUpdated(syncOptions.skipOptions));
      dispatch(
        skipTimeIndicatorColoursUpdated(syncOptions.skipTimeIndicatorColours)
      );
      dispatch(keybindsUpdated(syncOptions.keybinds));
      dispatch(skipTimeLengthUpdated(syncOptions.skipTimeLength));
      dispatch(
        changeCurrentTimeLengthUpdated(syncOptions.changeCurrentTimeLength)
      );
      dispatch(
        changeCurrentTimeLargeLengthUpdated(
          syncOptions.changeCurrentTimeLargeLength
        )
      );
      dispatch(animeTitleLanguageUpdated(syncOptions.animeTitleLanguage));
      setIsSettingsLoaded(true);
    })();
  }, []);

  /**
   * Sync options with sync browser storage.
   */
  useEffect(() => {
    if (isSettingsLoaded) {
      browser.storage.sync.set({
        skipOptions,
        skipTimeIndicatorColours,
        keybinds,
        skipTimeLength,
        changeCurrentTimeLength,
        changeCurrentTimeLargeLength,
        animeTitleLanguage,
      });
    }
  }, [
    skipOptions,
    skipTimeIndicatorColours,
    keybinds,
    skipTimeLength,
    changeCurrentTimeLength,
    changeCurrentTimeLargeLength,
    animeTitleLanguage,
    isSettingsLoaded,
  ]);

  return (
    <div className="sm:border sm:rounded-md border-gray-300 px-8 py-8 sm:bg-white">
      <h2 className="text-xl text-gray-900 font-semibold">Skip options</h2>
      <div className="space-y-3 mt-1">
        {filteredSkipTypes.map((skipType) => (
          <div className="space-y-1" key={skipType}>
            <span className="text-xs text-gray-700 uppercase font-semibold">
              {SKIP_TYPE_NAMES[skipType]}
            </span>
            <div className="flex justify-between items-center space-x-3">
              <Dropdown
                className="text-sm grow"
                value={skipOptions[skipType]!}
                onChange={onChangeSkipOption(skipType)}
                options={skipOptionDropdownOptions}
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
        <div className="space-y-1">
          <span className="text-xs text-gray-700 uppercase font-semibold">
            Skip menu behavior
          </span>
          <div className="space-y-3 divide-y">
            <Setting
              name="Skip time length"
              description="Time in seconds used when calculating the end time when the skip menu is opened."
            >
              <div className="flex items-end">
                <Input
                  className="text-xs select-none uppercase focus:ring-1 w-24 focus:ring-primary focus:border-primary"
                  type="number"
                  value={skipTimeLength}
                  spellCheck="false"
                  onChange={onChangeNumericInput(skipTimeLengthUpdated)}
                />
                <span className="pl-1">s</span>
              </div>
            </Setting>
            <Setting
              className="pt-3"
              name="Change current time"
              description="Time in seconds used when increasing or decreasing the start or end time used for fine-tuning."
            >
              <div className="flex items-end">
                <Input
                  className="text-xs select-none uppercase focus:ring-1 w-24 focus:ring-primary focus:border-primary"
                  type="number"
                  value={changeCurrentTimeLength}
                  spellCheck="false"
                  onChange={onChangeNumericInput(
                    changeCurrentTimeLengthUpdated
                  )}
                />
                <span className="pl-1">s</span>
              </div>
            </Setting>
            <Setting
              className="pt-3"
              name="Change current time (large)"
              description="Time in seconds used when increasing or decreasing the start or end time used for fine-tuning."
            >
              <div className="flex items-end">
                <Input
                  className="text-xs select-none uppercase focus:ring-1 w-24 focus:ring-primary focus:border-primary"
                  type="number"
                  value={changeCurrentTimeLargeLength}
                  spellCheck="false"
                  onChange={onChangeNumericInput(
                    changeCurrentTimeLargeLengthUpdated
                  )}
                />
                <span className="pl-1">s</span>
              </div>
            </Setting>
          </div>
        </div>
      </div>
      <h2 className="text-xl text-gray-900 font-semibold mt-8">
        Anime search overlay options
      </h2>
      <span className="text-xs text-gray-700 uppercase font-semibold block mt-3">
        Title language
      </span>
      <Dropdown
        className="text-sm grow mt-2"
        value={animeTitleLanguage}
        onChange={onChangeAnimeTitleLanguage}
        options={animeTitleLanguageDropdownOptions}
      />
      <div className="text-sm text-gray-500 mt-2">
        Language used to display titles when searching for anime.
      </div>
      <h2 className="text-xl text-gray-900 font-semibold mt-8">Keybinds</h2>
      <span className="text-xs text-gray-700 uppercase font-semibold mt-1">
        Anime search overlay
      </span>
      <div className="space-y-3 divide-y">
        {ANIME_SEARCH_OVERLAY_KEYBIND_TYPES.map(
          (type): JSX.Element => renderKeybindSetting(keybinds[type], type)
        )}
      </div>
      <hr className="mt-3" />
      <span className="text-xs text-gray-700 uppercase font-semibold">
        Submit menu
      </span>
      <div className="space-y-3 divide-y">
        {SUBMIT_MENU_KEYBIND_TYPES.map(
          (type): JSX.Element => renderKeybindSetting(keybinds[type], type)
        )}
      </div>
      <h2 className="text-xl text-gray-900 font-semibold mt-8">
        Miscellaneous options
      </h2>
      <div className="space-y-2 mt-1">
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
        className="sm:w-auto w-full border-2 border-primary text-primary hover:border-amber-600 hover:text-amber-600 font-medium mt-4"
        onClick={onClickClearCache}
      >
        Clear cache
      </DefaultButton>
    </div>
  );
}
