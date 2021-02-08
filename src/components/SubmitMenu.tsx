import React from 'react';

const defaultStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '32px',
  background: '#141519',
  color: 'white',
};

const SubmitMenu: React.FC = () => (
  <div style={{ ...defaultStyle }} role="menu">
    Nice Menu
  </div>
);

export default SubmitMenu;
