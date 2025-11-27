import React, { useState, useEffect, useRef } from 'react';

const ALL_COLUMNS = [
  { id: 'checkbox', label: 'Checkbox', fixed: true },
  { id: 'name', label: 'Name', fixed: true },
  { id: 'image', label: 'Image' },
  { id: 'tagline', label: 'Tagline' },
  { id: 'price', label: 'Price' },
  { id: 'status', label: 'Status' },
  { id: 'meals', label: 'Meals' },
  { id: 'days', label: 'Days' },
  { id: 'taxType', label: 'Tax Type' },
  { id: 'serviceFee', label: 'Service Fee' },
  { id: 'duration', label: 'Duration' },
  { id: 'turnovers', label: 'Turnovers' },
  { id: 'orderLimit', label: 'Order Limit' },
  { id: 'furthestBooking', label: 'Furthest Booking' },
  { id: 'closestBooking', label: 'Closest Booking' },
  { id: 'actions', label: 'Actions', fixed: true },
];

function ColumnVisibilityDropdown({ visibleColumns, onToggleColumn }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="columns-toggle-wrapper" ref={dropdownRef}>
      <button
        className="columns-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Column visibility"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="18"></rect>
          <rect x="14" y="3" width="7" height="18"></rect>
        </svg>
        Columns
      </button>

      {isOpen && (
        <div className="columns-dropdown">
          <div className="columns-list">
            <div className="columns-list-title">Show Columns</div>
            {ALL_COLUMNS.filter(col => !col.fixed).map((column) => (
              <label key={column.id} className="column-option">
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(column.id)}
                  onChange={() => onToggleColumn(column.id)}
                />
                <span>{column.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ColumnVisibilityDropdown;

