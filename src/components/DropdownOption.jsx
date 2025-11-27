import React from 'react';

function DropdownOption({ icon, title, description, onClick, className = '' }) {
  return (
    <button 
      className={`dropdown-option ${className}`}
      onClick={onClick}
    >
      <div className="dropdown-option-icon">
        {icon}
      </div>
      <div className="dropdown-option-content">
        <div className="dropdown-option-title">{title}</div>
        <div className="dropdown-option-description">{description}</div>
      </div>
    </button>
  );
}

export default DropdownOption;

