import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkiing } from '@fortawesome/free-solid-svg-icons';

const SettingsButton: React.FC = () => (
  <div style={{ width: '75%', height: '75%', cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faSkiing} />
  </div>
);

export default SettingsButton;
