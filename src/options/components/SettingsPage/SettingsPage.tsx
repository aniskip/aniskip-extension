import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { DefaultButton, Dropdown } from '../../../components';
import { LocalOptions, SkipOptionType } from '../../../scripts/background';

export const SettingsPage = (): JSX.Element => {
  const [opOption, setOpOption] = useState<SkipOptionType>('manual-skip');
  const [edOption, setEdOption] = useState<SkipOptionType>('manual-skip');

  const onChangeOpeningOption = (skipOption: SkipOptionType): void => {
    browser.storage.sync.set({ skipOptions: { op: skipOption, ed: edOption } });
    setOpOption(skipOption);
  };

  const onChangeEndingOption = (skipOption: SkipOptionType): void => {
    browser.storage.sync.set({ skipOptions: { op: opOption, ed: skipOption } });
    setEdOption(skipOption);
  };

  const onClickClearCache = (): void => {
    const cacheCleared: Partial<LocalOptions> = {
      rulesCache: {},
      malIdCache: {},
    };

    browser.storage.local.set(cacheCleared);
  };

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

  useEffect(() => {
    (async (): Promise<void> => {
      const { skipOptions } = await browser.storage.sync.get('skipOptions');
      setOpOption(skipOptions.op);
      setEdOption(skipOptions.ed);
    })();
  }, []);

  return (
    <div className="sm:border sm:rounded-md border-gray-300 px-8 py-8 sm:bg-white">
      <h1 className="text-lg text-gray-700 uppercase font-bold mb-4">
        Settings
      </h1>
      <div className="space-y-3 w-full">
        <div className="space-y-1">
          <div className="text-xs text-gray-600 uppercase font-bold">
            Opening default action
          </div>
          <Dropdown
            className="text-sm w-full"
            value={opOption}
            onChange={onChangeOpeningOption}
            options={dropdownOptions}
          />
        </div>
        <div className="space-y-1">
          <div className="text-xs text-gray-600 uppercase font-bold">
            Ending default action
          </div>
          <Dropdown
            className="text-sm w-full"
            value={edOption}
            onChange={onChangeEndingOption}
            options={dropdownOptions}
          />
        </div>
        <div className="space-y-1">
          <div className="text-xs text-gray-600 uppercase font-bold">Cache</div>
          <DefaultButton
            className="sm:w-auto w-full bg-primary border border-gray-300 text-white font-medium"
            onClick={onClickClearCache}
          >
            Clear cache
          </DefaultButton>
        </div>
      </div>
    </div>
  );
};
