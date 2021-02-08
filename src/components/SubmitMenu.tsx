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
    <div style={{ marginTop: '10px' }}>Menu title</div>
    <div>Menu item</div>
  </div>
);

export default SubmitMenu;
