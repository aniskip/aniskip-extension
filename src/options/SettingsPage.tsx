import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import classnames from 'classnames';
import Dropdown from '../components/Dropdown';
import { SkipOptionType } from '../types/options/skip_option_type';

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
    <div className={classnames('space-y-2')}>
      <div className={classnames('flex', 'justify-between')}>
        <span className={classnames('text-lg')}>Opening default action</span>
        <Dropdown
          className={classnames('w-48', 'inline-block')}
          value={openingOption}
          onChange={handleOpeningOptionChange}
          options={skipOptions}
        />
      </div>
      <div className={classnames('flex', 'justify-between')}>
        <span className={classnames('text-lg')}>Ending default action</span>
        <Dropdown
          className={classnames('w-48', 'inline-block')}
          value={endingOption}
          onChange={handleEndingOptionChange}
          options={skipOptions}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
