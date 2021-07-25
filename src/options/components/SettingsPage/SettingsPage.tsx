import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { DefaultButton, Dropdown } from '../../../components';
import { LocalOptions, SkipOptionType } from '../../../scripts/background';

export const SettingsPage = (): JSX.Element => {
  const [opOption, setOpOption] = useState<SkipOptionType>('manual-skip');
  const [edOption, setEdOption] = useState<SkipOptionType>('manual-skip');

  const handleOpeningOptionChange = (skipOption: SkipOptionType): void => {
    browser.storage.sync.set({ skipOptions: { op: skipOption, ed: edOption } });
    setOpOption(skipOption);
  };
  const handleEndingOptionChange = (skipOption: SkipOptionType): void => {
    browser.storage.sync.set({ skipOptions: { op: opOption, ed: skipOption } });
    setEdOption(skipOption);
  };
  const handleOnClickClearCache = (): void => {
    const cacheCleared = {
      rulesCache: {},
      malIdCache: {},
    } as Partial<LocalOptions>;

    browser.storage.local.set(cacheCleared);
  };

  const dropdownOptions = [
    {
      value: 'disabled',
      label: 'Disabled',
    },
    {
      value: 'auto-skip',
      label: 'Auto skip',
    },
    {
      value: 'manual-skip',
      label: 'Manual skip',
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
    <div className="sm:border sm:rounded-md border-gray-300 px-8 pt-8 pb-12 sm:bg-white">
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
            onChange={handleOpeningOptionChange}
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
            onChange={handleEndingOptionChange}
            options={dropdownOptions}
          />
        </div>
        <div className="space-y-1">
          <div className="text-xs text-gray-600 uppercase font-bold">Cache</div>
          <DefaultButton
            className="bg-primary border border-gray-300 text-white"
            onClick={handleOnClickClearCache}
          >
            Clear Cache
          </DefaultButton>
        </div>
      </div>
    </div>
  );
};
