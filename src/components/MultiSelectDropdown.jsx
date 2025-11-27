import React, { useState, useRef, useEffect } from 'react';

const MultiSelectDropdown = ({ 
  options = [], 
  value = [], 
  onChange, 
  placeholder = "Select options",
  searchable = false,
  showSelectAll = true,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAbove, setOpenAbove] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const dropdownContentRef = useRef(null);

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleSelectAll = () => {
    onChange(filteredOptions.map(option => option.value));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate available space and determine if dropdown should open above
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated before measuring
      requestAnimationFrame(() => {
        if (buttonRef.current) {
          const buttonRect = buttonRef.current.getBoundingClientRect();
          
          // Find the modal container (closest scrollable parent or modal)
          let scrollContainer = buttonRef.current.closest('.edit-modal-body-wrapper') || 
                               buttonRef.current.closest('.edit-modal-container');
          
          let availableBottom, availableTop;
          
          if (scrollContainer) {
            const containerRect = scrollContainer.getBoundingClientRect();
            // Calculate space within the modal container
            availableBottom = containerRect.bottom - buttonRect.bottom;
            availableTop = buttonRect.top - containerRect.top;
          } else {
            // Fallback to viewport if no modal container found
            const viewportHeight = window.innerHeight;
            availableBottom = viewportHeight - buttonRect.bottom;
            availableTop = buttonRect.top;
          }
          
          // Estimate dropdown height (approximate)
          // Search input: ~40px, Actions: ~40px, Options: max-height 180px
          const estimatedDropdownHeight = 260; // max-height from CSS
          
          // Check if we should open above (with 8px buffer)
          const shouldOpenAbove = availableBottom < estimatedDropdownHeight + 8 && availableTop > availableBottom;
          
          setOpenAbove(shouldOpenAbove);
        }
      });
    } else {
      setOpenAbove(false);
    }
  }, [isOpen, filteredOptions.length]);

  const getSelectedLabels = () => {
    return value.map(val => options.find(opt => opt.value === val)?.label).filter(Boolean);
  };

  const getButtonText = () => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) return getSelectedLabels()[0];
    return `${value.length} selected`;
  };

  return (
    <div className="multi-select-container" ref={dropdownRef}>
      <button
        ref={buttonRef}
        className={`edit-select multi-select-button ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        type="button"
      >
        <span className="multi-select-text">{getButtonText()}</span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && !disabled && (
        <div 
          ref={dropdownContentRef}
          className={`multi-select-dropdown ${openAbove ? 'above' : ''}`}
        >
          {searchable && (
            <div className="multi-select-search">
              <input
                type="text"
                className="multi-select-search-input"
                placeholder="Search options..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {showSelectAll && filteredOptions.length > 0 && (
            <div className="multi-select-actions">
              <button
                className="multi-select-action"
                onClick={handleSelectAll}
                type="button"
              >
                Select All
              </button>
              <button
                className="multi-select-action"
                onClick={handleClearAll}
                type="button"
              >
                Clear All
              </button>
            </div>
          )}

          <div className="multi-select-options">
            {filteredOptions.length === 0 ? (
              <div className="multi-select-no-options">No options found</div>
            ) : (
              filteredOptions.map(option => (
                <label
                  key={option.value}
                  className="multi-select-option"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => handleToggle(option.value)}
                    className="multi-select-checkbox"
                  />
                  <span className="multi-select-option-label">{option.label}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
