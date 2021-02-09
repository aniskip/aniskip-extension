import React from 'react';
import { SubmitMenuProps } from '../types/components/submit_types';

const SubmitMenu: React.FC<SubmitMenuProps> = ({
  submitButtonHeight,
}: SubmitMenuProps) => (
  <div
    className="submit-menu"
    style={{ bottom: submitButtonHeight }}
    role="menu"
  >
    <div className="tw-mt-2">Menu title</div>
    <div>Menu item</div>
  </div>
);

export default SubmitMenu;
