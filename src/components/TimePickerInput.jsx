import React, { useState, useEffect } from 'react';

const TimePickerInput = ({ value, onChange, placeholder = "00:00", disabled = false }) => {
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const formatAndValidateTime = (timeStr) => {
    if (!timeStr || timeStr.trim() === '') {
      return '';
    }
    
    // Remove all non-digit characters
    const digits = timeStr.replace(/\D/g, '');
    
    if (digits.length === 0) {
      return '';
    }
    
    // Parse hours and minutes
    let hours = 0;
    let minutes = 0;
    
    if (digits.length === 1) {
      hours = parseInt(digits[0], 10);
    } else if (digits.length === 2) {
      hours = parseInt(digits.slice(0, 2), 10);
    } else if (digits.length === 3) {
      hours = parseInt(digits.slice(0, 1), 10);
      minutes = parseInt(digits.slice(1, 3), 10);
    } else {
      hours = parseInt(digits.slice(0, 2), 10);
      minutes = parseInt(digits.slice(2, 4), 10);
    }
    
    // Validate and clamp ranges
    if (hours > 23) {
      hours = 23;
    }
    if (minutes > 59) {
      minutes = 59;
    }
    
    // Format as HH:MM
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleInputChange = (e) => {
    // Allow user to type freely without interference
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Clear value if empty
    if (newValue === '') {
      onChange('');
    }
  };

  const handleBlur = () => {
    // Format and validate only on blur
    const formatted = formatAndValidateTime(inputValue);
    
    if (formatted) {
      setInputValue(formatted);
      onChange(formatted);
    } else if (inputValue && inputValue.trim() !== '') {
      // If invalid input, reset to previous valid value
      setInputValue(value || '');
    } else {
      // Empty input - clear it
      setInputValue('');
      onChange('');
    }
  };

  return (
    <div className="time-picker-container">
      <input
        type="text"
        className="edit-input time-picker-input"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default TimePickerInput;
