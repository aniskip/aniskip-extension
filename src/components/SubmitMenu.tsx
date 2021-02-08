import React from 'react';
import { SubmitMenuProps } from '../types/components/submit_types';

const defaultStyle: React.CSSProperties = {
  position: 'absolute',
  background: '#141519',
  color: 'white',
  right: 0,
  width: '400px',
  height: '300px',
  textAlign: 'left',
  paddingLeft: '15px',
  paddingRight: '15px',
  userSelect: 'none',
};

const SubmitMenu: React.FC<SubmitMenuProps> = ({
  submitButtonHeight,
}: SubmitMenuProps) => (
  <div style={{ bottom: submitButtonHeight, ...defaultStyle }} role="menu">
    <div style={{ marginTop: '10px' }}>Menu title</div>
    <div>Menu item</div>
  </div>
);

export default SubmitMenu;
