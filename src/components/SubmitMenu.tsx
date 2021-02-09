import React from 'react';
import classnames from 'classnames';
import { SubmitMenuProps } from '../types/components/submit_types';

const SubmitMenu: React.FC<SubmitMenuProps> = ({
  variant,
}: SubmitMenuProps) => (
  <div
    className={classnames('submit-menu', `submit-menu--${variant}`)}
    role="menu"
  >
    <div className="tw-mt-2">Menu title</div>
    <div>Menu item</div>
  </div>
);

export default SubmitMenu;
