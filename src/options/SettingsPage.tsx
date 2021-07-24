import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';

import { Dropdown } from '../components';
import { SkipOptionType } from '../scripts/background';

const SettingsPage = (): JSX.Element => {
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
      <div className="space-y-2 w-full">
        <div className="text-xs text-gray-600 uppercase font-bold">
          Opening default action
        </div>
        <Dropdown
          className="text-sm w-full"
          value={opOption}
          onChange={handleOpeningOptionChange}
          options={dropdownOptions}
        />
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
    </div>
  );
};

export default SettingsPage;
