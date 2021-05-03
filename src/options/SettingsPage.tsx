import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import Dropdown from '../components/Dropdown';
import { SkipOptionType } from '../types/options/skip_option_type';
// import SettingsNavigation from '../components/SettingsNavigation';

const SettingsPage: React.FC = () => {
  const [openingOption, setOpeningOption] = useState<SkipOptionType>(
    'manual-skip'
  );
  const [endingOption, setEndingOption] = useState<SkipOptionType>(
    'manual-skip'
  );

  const handleOpeningOptionChange = (skipOption: SkipOptionType) => {
    browser.storage.sync.set({ openingOption: skipOption });
    setOpeningOption(skipOption);
  };
  const handleEndingOptionChange = (skipOption: SkipOptionType) => {
    browser.storage.sync.set({ endingOption: skipOption });
    setEndingOption(skipOption);
  };

  const skipOptions = [
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
    (async () => {
      const {
        openingOption: openingOptionRetrieved,
        endingOption: endingOptionRetrieved,
      } = await browser.storage.sync.get({
        openingOption: 'manual-skip',
        endingOption: 'manual-skip',
      });
      setOpeningOption(openingOptionRetrieved);
      setEndingOption(endingOptionRetrieved);
    })();
  }, [setOpeningOption, setEndingOption]);

  return (
    <div className="sm:flex sm:space-x-6 pt-8 border px-10 py-10 rounded-md bg-white">
      {/* <SettingsNavigation /> */}
      <div className="space-y-2 w-full">
        {/* <div className="flex justify-between"> */}
        <div className="text-lg">Opening default action</div>
        <Dropdown
          className="w-full"
          value={openingOption}
          onChange={handleOpeningOptionChange}
          options={skipOptions}
        />
        {/* </div> */}
        {/* <div className="flex justify-between"> */}
        <div className="text-lg">Ending default action</div>
        <Dropdown
          className="w-full"
          value={endingOption}
          onChange={handleEndingOptionChange}
          options={skipOptions}
        />
        {/* </div> */}
      </div>
    </div>
  );
};

export default SettingsPage;
