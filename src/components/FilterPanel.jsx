import React, { useState, useEffect, useRef } from 'react';
import { useMenu } from '../context/MenuContext';

const FILTER_CATEGORIES = {
  status: {
    label: 'Status',
    options: ['Online', 'Hidden', 'Manager Only', 'Disabled'],
  },
  category: {
    label: 'Category',
    options: ['Courses', 'Appetizers', 'Main Courses', 'Desserts', 'Beverages', 'Specials'],
  },
  meals: {
    label: 'Meals',
    options: ['All', 'Breakfast', 'Lunch', 'Dinner', 'Brunch'],
  },
  days: {
    label: 'Days',
    options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
};

function FilterPanel({ isOpen, onClose }) {
  const { state, setFilters } = useMenu();
  const [activeCategory, setActiveCategory] = useState('status');
  const [localFilters, setLocalFilters] = useState(state.filters);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        // Check if clicked element is the filter button
        const filterButton = document.querySelector('.filter-button');
        if (filterButton && !filterButton.contains(event.target)) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setLocalFilters(state.filters);
  }, [state.filters]);

  const handleToggleFilter = (category, option) => {
    const newFilters = { ...localFilters };
    const currentOptions = newFilters[category] || [];
    const isArchived = option === 'Archived';
    const regularStatuses = ['Online', 'Hidden', 'Manager Only', 'Disabled'];
    
    if (currentOptions.includes(option)) {
      // Unchecking - just remove the option
      newFilters[category] = currentOptions.filter(o => o !== option);
    } else {
      // Checking - implement mutually exclusive logic for status category
      if (category === 'status') {
        if (isArchived) {
          // If selecting Archived, clear all other statuses
          newFilters[category] = ['Archived'];
        } else {
          // If selecting a regular status, clear Archived if present
          newFilters[category] = [...currentOptions.filter(o => o !== 'Archived'), option];
        }
      } else {
        // For other categories, use normal multi-select
        newFilters[category] = [...currentOptions, option];
      }
    }
    
    setLocalFilters(newFilters);
    setFilters(newFilters);
  };

  const handleClearAll = () => {
    const emptyFilters = {
      status: [],
      category: [],
      meals: [],
      days: [],
    };
    setLocalFilters(emptyFilters);
    setFilters(emptyFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters).reduce((total, arr) => total + arr.length, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="filter-panel" ref={panelRef} style={{ display: 'flex' }}>
      {/* Left Side - Categories */}
      <div className="filter-panel-left">
        {Object.keys(FILTER_CATEGORIES).map((key) => (
          <div
            key={key}
            className={`filter-category ${activeCategory === key ? 'active' : ''}`}
            onClick={() => setActiveCategory(key)}
          >
            <span>{FILTER_CATEGORIES[key].label}</span>
            {localFilters[key]?.length > 0 && (
              <span className="filter-indicator">{localFilters[key].length}</span>
            )}
          </div>
        ))}

        {/* Clear All at bottom */}
        <div className="filter-actions">
          {getActiveFilterCount() > 0 && (
            <button className="clear-all" onClick={handleClearAll}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Right Side - Options */}
      <div className="filter-panel-right">
        <div className="filter-content">
          <h3>{FILTER_CATEGORIES[activeCategory].label}</h3>
          <div className="filter-options">
            {activeCategory === 'status' ? (
              <>
                {/* Regular Status Options */}
                {FILTER_CATEGORIES[activeCategory].options.map((option) => (
                  <label key={option} className="filter-option">
                    <input
                      type="checkbox"
                      checked={localFilters[activeCategory]?.includes(option) || false}
                      onChange={() => handleToggleFilter(activeCategory, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
                {/* Divider */}
                <div className="filter-option-divider"></div>
                {/* Archived Option */}
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={localFilters[activeCategory]?.includes('Archived') || false}
                    onChange={() => handleToggleFilter(activeCategory, 'Archived')}
                  />
                  <span>Archived</span>
                </label>
              </>
            ) : (
              FILTER_CATEGORIES[activeCategory].options.map((option) => (
                <label key={option} className="filter-option">
                  <input
                    type="checkbox"
                    checked={localFilters[activeCategory]?.includes(option) || false}
                    onChange={() => handleToggleFilter(activeCategory, option)}
                  />
                  <span>{option}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;

