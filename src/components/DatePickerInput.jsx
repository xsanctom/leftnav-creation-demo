import React, { useState, useRef, useEffect } from 'react';

const DatePickerInput = ({ value, onChange, placeholder = "Select date", disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const dropdownRef = useRef(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    onChange(formatDate(newDate));
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const today = new Date();
    
    const calendarDays = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && 
                     today.getMonth() === currentMonth.getMonth() && 
                     today.getFullYear() === currentMonth.getFullYear();
      
      const isSelected = selectedDate && 
                        selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentMonth.getMonth() && 
                        selectedDate.getFullYear() === currentMonth.getFullYear();
      
      calendarDays.push(
        <button
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </button>
      );
    }
    
    return calendarDays;
  };

  return (
    <div className="date-picker-container" ref={dropdownRef}>
      <input
        type="text"
        className="edit-input date-picker-input"
        value={selectedDate ? formatDate(selectedDate) : ''}
        onChange={() => {}} // Controlled by calendar selection
        onFocus={() => !disabled && setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly
      />
      
      {isOpen && !disabled && (
        <div className="date-picker-dropdown">
          <div className="date-picker-header">
            <button 
              className="date-picker-nav" 
              onClick={handlePrevMonth}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <div className="date-picker-month-year">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            
            <button 
              className="date-picker-nav" 
              onClick={handleNextMonth}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          
          <div className="date-picker-weekdays">
            {days.map(day => (
              <div key={day} className="calendar-weekday">{day}</div>
            ))}
          </div>
          
          <div className="date-picker-calendar">
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerInput;
