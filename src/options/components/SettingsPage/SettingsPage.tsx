import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { browser } from 'webextension-polyfill-ts';
import { ColorResult } from 'react-color';
import { debounce } from 'lodash';
import { sprintf } from 'sprintf-js';
import { SkipType, SKIP_TYPES, SKIP_TYPE_NAMES } from '../../../api';
import {
  DefaultButton,
  Dropdown,
  Input,
  Keyboard,
  Toggle,
} from '../../../components';
import {
  ANIME_SEARCH_OVERLAY_KEYBIND_TYPES,
  AnimeTitleLanguageType,
  DEFAULT_SYNC_OPTIONS,
  KEYBIND_INFO,
  KEYBIND_NAMES,
  KeybindType,
  LocalOptions,
  PLAYER_CONTROLS_KEYBIND_TYPES,
  SUBMIT_MENU_KEYBIND_TYPES,
  SkipOptionType,
  SkipTimeIndicatorColours,
  SyncOptions,
} from '../../../scripts/background';
import {
  animeTitleLanguageUpdated,
  changeCurrentTimeFramesLargeUpdated,
  changeCurrentTimeFramesUpdated,
  isPreviewButtonEmulatingAutoSkipUpdated,
  isUserEditingKeybindUpdated,
  keybindUpdated,
  keybindsUpdated,
  selectAnimeTitleLanguage,
  selectChangeCurrentTimeFramesLarge,
  selectChangeCurrentTimeFrames,
  selectIsPreviewButtonEmulatingAutoSkip,
  selectIsUserEditingKeybind,
  selectKeybinds,
  selectSkipOptions,
  selectSkipTimeIndicatorColours,
  selectSkipTimeLength,
  skipOptionUpdated,
  skipOptionsUpdated,
  skipTimeIndicatorColourUpdated,
  skipTimeIndicatorColoursUpdated,
  skipTimeLengthUpdated,
} from '../../../data';
import { ColourPicker } from '../ColourPicker';
import { serialiseKeybind, useDispatch, useSelector } from '../../../utils';
import { Setting } from '../Setting';

export function SettingsPage(): JSX.Element {
  const [isSettingsLoaded, setIsSettingsLoaded] = useState<boolean>(false);
  const skipOptions = useSelector(selectSkipOptions);
  const skipTimeIndicatorColours = useSelector(selectSkipTimeIndicatorColours);
  const keybinds = useSelector(selectKeybinds);
  const skipTimeLength = useSelector(selectSkipTimeLength);
  const changeCurrentTimeFrames = useSelector(selectChangeCurrentTimeFrames);
  const changeCurrentTimeFramesLarge = useSelector(
    selectChangeCurrentTimeFramesLarge
  );
  const animeTitleLanguage = useSelector(selectAnimeTitleLanguage);
  const isUserEditingKeybind = useSelector(selectIsUserEditingKeybind);
  const isPreviewButtonEmulatingAutoSkip = useSelector(
    selectIsPreviewButtonEmulatingAutoSkip
  );
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
    (skipType: keyof SkipTimeIndicatorColours) =>
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
        return sprintf(KEYBIND_INFO[keybindType], changeCurrentTimeFrames);
      case 'increase-current-time-large':
      case 'decrease-current-time-large':
        return sprintf(KEYBIND_INFO[keybindType], changeCurrentTimeFramesLarge);
      case 'skip-backward':
      case 'skip-forward':
        return sprintf(KEYBIND_INFO[keybindType], skipTimeLength);
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
    (
      action: ActionCreatorWithPayload<number, string>,
      round: boolean = false
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      let number = parseFloat(event.target.value) || 0;

      if (round) {
        number = Math.round(number);
      }

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
   * Handles changes to the skip preview behavour.
   *
   * @param value New value to update to.
   */
  const onChangePreviewButtonBehaviour = (value: boolean): void => {
    dispatch(isPreviewButtonEmulatingAutoSkipUpdated(value));
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
        <div className="rounded border border-transparent border-gray-300 bg-primary px-4 py-2 text-sm font-medium text-white focus:outline-none">
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
            className="w-36 select-none text-xs uppercase focus:border-primary focus:ring-1 focus:ring-primary"
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
        changeCurrentTimeFramesUpdated(syncOptions.changeCurrentTimeFrames)
      );
      dispatch(
        changeCurrentTimeFramesLargeUpdated(
          syncOptions.changeCurrentTimeFramesLarge
        )
      );
      dispatch(animeTitleLanguageUpdated(syncOptions.animeTitleLanguage));
      dispatch(
        isPreviewButtonEmulatingAutoSkipUpdated(
          syncOptions.isPreviewButtonEmulatingAutoSkip
        )
      );
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
        changeCurrentTimeFrames,
        changeCurrentTimeFramesLarge,
        animeTitleLanguage,
        isPreviewButtonEmulatingAutoSkip,
      });
    }
  }, [
    skipOptions,
    skipTimeIndicatorColours,
    keybinds,
    skipTimeLength,
    changeCurrentTimeFrames,
    changeCurrentTimeFramesLarge,
    animeTitleLanguage,
    isSettingsLoaded,
    isPreviewButtonEmulatingAutoSkip,
  ]);

  return (
    <div className="border-gray-300 px-8 py-8 sm:rounded-md sm:border sm:bg-white">
      <h2 className="text-xl font-semibold text-gray-900">Skip options</h2>
      <div className="mt-1 space-y-3">
        {SKIP_TYPES.map((skipType) => (
          <div className="space-y-1" key={skipType}>
            <span className="text-xs font-semibold uppercase text-gray-700">
              {SKIP_TYPE_NAMES[skipType]}
            </span>
            <div className="flex items-center justify-between space-x-3">
              <Dropdown
                className="grow text-sm"
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
      </div>
      <hr className="mt-6" />
      <Setting
        className="mt-3"
        name="Preview skip indicator colour"
        description="Appears when you are creating a skip time."
      >
        <ColourPicker
          colour={skipTimeIndicatorColours.preview}
          onChangeComplete={onChangeCompleteSkipTimeIndicatorColour('preview')}
        />
      </Setting>
      <hr className="mt-3" />
      <div className="mt-3 space-y-1">
        <span className="text-xs font-semibold uppercase text-gray-700">
          Skip menu behavior
        </span>
        <div className="space-y-3 divide-y">
          <Setting
            name="Skip time length"
            description="Time in frames used when calculating the end time when the skip menu is opened. It is also used when using the skip forward or backward keybind."
          >
            <div className="flex items-end">
              <Input
                className="w-24 select-none text-xs uppercase focus:border-primary focus:ring-1 focus:ring-primary"
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
            description="Time in frames used when increasing or decreasing the start or end time used for fine-tuning."
          >
            <div className="flex items-end">
              <Input
                className="w-24 select-none text-xs uppercase focus:border-primary focus:ring-1 focus:ring-primary"
                type="number"
                min={1}
                step={1}
                pattern="\d+"
                value={changeCurrentTimeFrames}
                spellCheck="false"
                onChange={onChangeNumericInput(
                  changeCurrentTimeFramesUpdated,
                  true
                )}
              />
              <span className="pl-1">frame(s)</span>
            </div>
          </Setting>
          <Setting
            className="pt-3"
            name="Change current time (large)"
            description="Time in frames used when increasing or decreasing the start or end time used for fine-tuning."
          >
            <div className="flex items-end">
              <Input
                className="w-24 select-none text-xs uppercase focus:border-primary focus:ring-1 focus:ring-primary"
                type="number"
                min={1}
                step={1}
                pattern="\d+"
                value={changeCurrentTimeFramesLarge}
                spellCheck="false"
                onChange={onChangeNumericInput(
                  changeCurrentTimeFramesLargeUpdated,
                  true
                )}
              />
              <span className="pl-1">frame(s)</span>
            </div>
          </Setting>
          <Setting
            className="pt-3"
            name="Emulate an auto skip with the preview button"
            description="Clicking the preview button will try to emulate a user auto skipping to the end time. If disabled, the current time is simply set to the start / end time."
          >
            <Toggle
              checked={isPreviewButtonEmulatingAutoSkip}
              onChange={onChangePreviewButtonBehaviour}
            >
              <span className="sr-only">
                Enable skip time emulation on preview button click
              </span>
            </Toggle>
          </Setting>
        </div>
      </div>
      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        Anime search overlay options
      </h2>
      <span className="mt-3 block text-xs font-semibold uppercase text-gray-700">
        Title language
      </span>
      <Dropdown
        className="mt-2 grow text-sm"
        value={animeTitleLanguage}
        onChange={onChangeAnimeTitleLanguage}
        options={animeTitleLanguageDropdownOptions}
      />
      <div className="mt-2 text-sm text-gray-500">
        Language used to display titles when searching for anime.
      </div>
      <h2 className="mt-8 text-xl font-semibold text-gray-900">Keybinds</h2>
      <span className="mt-1 text-xs font-semibold uppercase text-gray-700">
        Anime search overlay
      </span>
      <div className="space-y-3 divide-y">
        {ANIME_SEARCH_OVERLAY_KEYBIND_TYPES.map(
          (type): JSX.Element => renderKeybindSetting(keybinds[type], type)
        )}
      </div>
      <hr className="my-3" />
      <span className="text-xs font-semibold uppercase text-gray-700">
        Submit menu
      </span>
      <div className="space-y-3 divide-y">
        {SUBMIT_MENU_KEYBIND_TYPES.map(
          (type): JSX.Element => renderKeybindSetting(keybinds[type], type)
        )}
      </div>
      <hr className="my-3" />
      <span className="text-xs font-semibold uppercase text-gray-700">
        Player controls
      </span>
      <div className="space-y-3 divide-y">
        {PLAYER_CONTROLS_KEYBIND_TYPES.map(
          (type): JSX.Element => renderKeybindSetting(keybinds[type], type)
        )}
      </div>
      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        Miscellaneous options
      </h2>
      <div className="mt-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase text-gray-700">
            Cache
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Are skip times incorrectly mapped? This will remove any cached
          anime-relations rules and cached anime title to MAL id mapping.
        </div>
      </div>
      <DefaultButton
        className="mt-4 w-full border-2 border-primary font-medium text-primary hover:border-amber-600 hover:text-amber-600 sm:w-auto"
        onClick={onClickClearCache}
      >
        Clear cache
      </DefaultButton>
    </div>
  );
}
