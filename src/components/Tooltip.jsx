import React from 'react';
import './Tooltip.css';

const Tooltip = ({ text }) => {
  return (
    <span className="tooltip-container">
      <span className="tooltip-icon">?</span>
      <span className="tooltip-text">{text}</span>
    </span>
  );
};

export default Tooltip;