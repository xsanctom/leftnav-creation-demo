import React, { useState, useRef, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';

function MenuTableEnhanced({ onEditItem, visibleColumns = [] }) {
  const { state, deleteMenuItem, toggleItemSelection, setSelectedItems, archiveMenuItem, unarchiveMenuItem } = useMenu();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const menuRef = useRef(null);

  // Apply filters helper
  const applyFilters = (items) => {
    return items.filter(item => {
      // Search filter
      if (state.searchQuery && !item.name?.toLowerCase().includes(state.searchQuery.toLowerCase())) {
        return false;
      }

      // Status filter - handle archived status specially
      const statusFilters = state.filters.status || [];
      const isArchived = item.status === 'Archived';
      const hasArchivedFilter = statusFilters.includes('Archived');
      const hasOtherStatusFilters = statusFilters.some(s => s !== 'Archived');

      if (isArchived) {
        // Archived items only show when Archived filter is active
        if (!hasArchivedFilter) {
          return false;
        }
      } else {
        // Non-archived items: if Archived filter is active, exclude them
        // If other status filters are active, check if item matches
        if (hasArchivedFilter) {
          return false;
        }
        if (hasOtherStatusFilters && !statusFilters.includes(item.status)) {
          return false;
        }
      }

      // Category filter
      if (state.filters.category.length > 0 && !state.filters.category.includes(item.category)) {
        return false;
      }

      // Meals filter
      if (state.filters.meals.length > 0) {
        const itemMeals = Array.isArray(item.meals) ? item.meals : [item.meals];
        const hasMatch = state.filters.meals.some(meal => itemMeals.includes(meal));
        if (!hasMatch) return false;
      }

      // Days filter
      if (state.filters.days.length > 0) {
        const itemDays = Array.isArray(item.days) ? item.days : [item.days];
        const hasMatch = state.filters.days.some(day => itemDays.includes(day));
        if (!hasMatch) return false;
      }

      return true;
    });
  };

  // Group items by category
  const groupedItems = state.menuItems.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Filter items based on search and filters
  const filteredGroupedItems = Object.keys(groupedItems).reduce((acc, category) => {
    const filtered = applyFilters(groupedItems[category]);
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  const isColumnVisible = (columnId) => {
    return visibleColumns.includes(columnId);
  };

  // Click outside handler for overflow menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div className="menu-grid-container" style={{ marginTop: '16px' }}>
      {/* Fixed Left Section */}
      <div className="grid-fixed-left">
        {/* Header Row - Fixed Part */}
        <div className="grid-row header-row">
          <div className="fixed-columns">
            <div className="cell-drag"></div>
            <div className="cell-checkbox"></div>
            <div className="cell-name">Item</div>
            <div className="cell-actions"></div>
            {isColumnVisible('image') && <div className="cell-image"></div>}
          </div>
        </div>

        {/* Category + Item Rows - Fixed Part */}
        {Object.keys(filteredGroupedItems).length === 0 ? (
          <div className="grid-row empty-state">
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-subtle)', width: '100%' }}>
              No menu items found. Click "New" to add items.
            </div>
          </div>
        ) : (
          Object.keys(filteredGroupedItems).map((category) => (
            <React.Fragment key={category}>
              {/* Category Header - Fixed Part */}
              <div 
                className={`grid-row category-row ${hoveredRowId === `cat-${category}` ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredRowId(`cat-${category}`)}
                onMouseLeave={() => setHoveredRowId(null)}
              >
                <div className="fixed-columns">
                  <div className="cell-drag"></div>
                  <div className="cell-checkbox">
                    <input type="checkbox" className="category-checkbox" />
                  </div>
                  <div className="cell-name category-name">
                    {category}
                    <span className="category-count-badge">{filteredGroupedItems[category].length} items</span>
                  </div>
                  <div className="cell-actions"></div>
                  {isColumnVisible('image') && <div className="cell-image"></div>}
                </div>
              </div>

              {/* Item Rows - Fixed Part */}
              {filteredGroupedItems[category].map((item) => (
                <div 
                  key={item.id} 
                  className={`grid-row item-row ${hoveredRowId === item.id ? 'hovered' : ''}`}
                  data-row-id={item.id}
                  onMouseEnter={() => setHoveredRowId(item.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  onClick={(e) => {
                    // Don't trigger if clicking checkbox or overflow menu
                    if (e.target.closest('input[type="checkbox"]') || 
                        e.target.closest('.overflow-menu-wrapper')) {
                      return;
                    }
                    onEditItem(item.id);
                  }}
                >
                  <div className="fixed-columns">
                    {/* Drag Handle */}
                    <div className="cell-drag">
                      <div className="drag-handle">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-placeholder)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="5" r="1"></circle>
                          <circle cx="9" cy="12" r="1"></circle>
                          <circle cx="9" cy="19" r="1"></circle>
                          <circle cx="15" cy="5" r="1"></circle>
                          <circle cx="15" cy="12" r="1"></circle>
                          <circle cx="15" cy="19" r="1"></circle>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Checkbox */}
                    <div className="cell-checkbox">
                      <input 
                        type="checkbox" 
                        className="row-checkbox"
                        checked={state.selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                      />
                    </div>
                    
                    {/* Name */}
                    <div className="cell-name">
                      {item.name}
                    </div>
                    
                    {/* Overflow Menu */}
                    <div className="cell-actions">
                      <div className="overflow-menu-wrapper" ref={openMenuId === item.id ? menuRef : null}>
                        <button 
                          className="overflow-menu-button"
                          onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                          title="More options"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        
                        {openMenuId === item.id && (
                          <div className="overflow-menu-dropdown">
                            {item.status === 'Archived' ? (
                              <>
                                {/* Archived items: Only Audit Trail and Unarchive */}
                                <button className="overflow-menu-item" onClick={() => setOpenMenuId(null)}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                  </svg>
                                  Audit trail
                                </button>
                                <div className="overflow-menu-divider"></div>
                                <button 
                                  className="overflow-menu-item" 
                                  onClick={() => { 
                                    unarchiveMenuItem(item.id); 
                                    setOpenMenuId(null); 
                                  }}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 15v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                  </svg>
                                  Unarchive
                                </button>
                              </>
                            ) : (
                              <>
                                {/* Non-archived items: Full menu */}
                                <button className="overflow-menu-item" onClick={() => { onEditItem(item.id); setOpenMenuId(null); }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                                  Edit
                                </button>
                                <button className="overflow-menu-item" onClick={() => setOpenMenuId(null)}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                  </svg>
                                  Copy
                                </button>
                                <button className="overflow-menu-item" onClick={() => setOpenMenuId(null)}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                  </svg>
                                  Audit trail
                                </button>
                                <div className="overflow-menu-divider"></div>
                                <button 
                                  className="overflow-menu-item overflow-menu-item-danger" 
                                  onClick={() => { 
                                    if (window.confirm('Archive this menu item?')) {
                                      archiveMenuItem(item.id);
                                    }
                                    setOpenMenuId(null); 
                                  }}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                  Archive
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Image */}
                    {isColumnVisible('image') && (
                      <div className="cell-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="menu-item-thumbnail" />
                        ) : (
                          <div style={{ width: '52px', height: '52px', background: 'var(--surface-low)', borderRadius: '4px' }}></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Scrollable Right Section */}
      <div className="grid-scrollable-right">
        {/* Header Row - Scrollable Part */}
        <div className="grid-row header-row">
          <div className="scrollable-columns">
            {isColumnVisible('price') && <div className="cell-column">Price</div>}
            {isColumnVisible('status') && <div className="cell-column">Status</div>}
            {isColumnVisible('tagline') && <div className="cell-column">Tagline</div>}
            {(isColumnVisible('meals') || isColumnVisible('days')) && (
              <div className="cell-column-wide">
                {isColumnVisible('meals') && isColumnVisible('days') 
                  ? 'Meals & Days'
                  : isColumnVisible('meals') 
                    ? 'Meals'
                    : 'Days'}
              </div>
            )}
            {isColumnVisible('taxType') && <div className="cell-column">Tax Type</div>}
            {isColumnVisible('serviceFee') && <div className="cell-column">Service Fee</div>}
            {isColumnVisible('duration') && <div className="cell-column">Duration</div>}
            {isColumnVisible('turnovers') && <div className="cell-column">Turnovers</div>}
            {isColumnVisible('orderLimit') && <div className="cell-column">Order Limit</div>}
            {isColumnVisible('furthestBooking') && <div className="cell-column">Furthest Booking</div>}
            {isColumnVisible('closestBooking') && <div className="cell-column">Closest Booking</div>}
          </div>
        </div>

        {/* Category + Item Rows - Scrollable Part */}
        {Object.keys(filteredGroupedItems).length === 0 ? (
          <div className="grid-row empty-state">
            <div style={{ visibility: 'hidden', padding: '40px' }}>Spacer</div>
          </div>
        ) : (
          Object.keys(filteredGroupedItems).map((category) => (
            <React.Fragment key={category}>
              {/* Category Header - Scrollable Part */}
              <div 
                className={`grid-row category-row ${hoveredRowId === `cat-${category}` ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredRowId(`cat-${category}`)}
                onMouseLeave={() => setHoveredRowId(null)}
              >
                <div className="scrollable-columns">
                  {/* Empty scrollable section for category row */}
                </div>
              </div>

              {/* Item Rows - Scrollable Part */}
              {filteredGroupedItems[category].map((item) => (
                <div 
                  key={item.id} 
                  className={`grid-row item-row ${hoveredRowId === item.id ? 'hovered' : ''}`}
                  data-row-id={item.id}
                  onMouseEnter={() => setHoveredRowId(item.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  onClick={() => onEditItem(item.id)}
                >
                  <div className="scrollable-columns">
                    {/* Price */}
                    {isColumnVisible('price') && (
                      <div className="cell-column">
                        <span className="price">¥{item.price || '0'}</span>
                      </div>
                    )}
                    
                    {/* Status */}
                    {isColumnVisible('status') && (
                      <div className="cell-column">
                        <span className={`status-tag status-${item.status?.toLowerCase() || 'online'}`}>
                          {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Online'}
                        </span>
                      </div>
                    )}
                    
                    {/* Tagline */}
                    {isColumnVisible('tagline') && (
                      <div className="cell-column">
                        {item.tagline || '-'}
                      </div>
                    )}
                    
                    {/* Meals & Days */}
                    {(isColumnVisible('meals') || isColumnVisible('days')) && (
                      <div className="cell-column-wide">
                        <div className="chip-container">
                          {/* Meals row */}
                          {isColumnVisible('meals') && item.meals && (
                            <div className="chip-row">
                              {(() => {
                                const meals = Array.isArray(item.meals) ? item.meals : [item.meals];
                                const allMeals = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Brunch'];
                                const hasAllMeals = allMeals.every(meal => meals.includes(meal));
                                
                                if (hasAllMeals) {
                                  return <span className="chip-meal">All Meals</span>;
                                }
                                
                                const mealAbbrev = (meal) => {
                                  return meal; // Display full meal names
                                };
                                return meals.filter(Boolean).map((meal, idx) => (
                                  <span key={idx} className="chip-meal">{mealAbbrev(meal)}</span>
                                ));
                              })()}
                            </div>
                          )}
                          {/* Days row */}
                          {isColumnVisible('days') && item.days && (
                            <div className="chip-row">
                              {(() => {
                                const days = Array.isArray(item.days) ? item.days : [item.days];
                                const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                                const hasAllDays = allDays.every(day => days.includes(day));
                                
                                if (hasAllDays) {
                                  return <span className="chip-day">All Days</span>;
                                }
                                
                                const dayAbbrev = (day) => {
                                  const abbrevs = { 'Sunday': 'Su', 'Monday': 'M', 'Tuesday': 'Tu', 'Wednesday': 'W', 'Thursday': 'Th', 'Friday': 'F', 'Saturday': 'Sa' };
                                  return abbrevs[day] || day.slice(0, 2);
                                };
                                return days.filter(Boolean).map((day, idx) => (
                                  <span key={idx} className="chip-day">{dayAbbrev(day)}</span>
                                ));
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Tax Type */}
                    {isColumnVisible('taxType') && (
                      <div className="cell-column">
                        {item.taxType || '-'}
                      </div>
                    )}
                    
                    {/* Service Fee */}
                    {isColumnVisible('serviceFee') && (
                      <div className="cell-column">
                        ${item.serviceFee || '0'}
                      </div>
                    )}
                    
                    {/* Duration */}
                    {isColumnVisible('duration') && (
                      <div className="cell-column">
                        {item.duration || '-'}
                      </div>
                    )}
                    
                    {/* Turnovers */}
                    {isColumnVisible('turnovers') && (
                      <div className="cell-column">
                        {item.turnovers || '-'}
                      </div>
                    )}
                    
                    {/* Order Limit */}
                    {isColumnVisible('orderLimit') && (
                      <div className="cell-column">
                        {item.orderLimit || '-'}
                      </div>
                    )}
                    
                    {/* Furthest Booking */}
                    {isColumnVisible('furthestBooking') && (
                      <div className="cell-column">
                        {item.furthestBooking || '-'}
                      </div>
                    )}
                    
                    {/* Closest Booking */}
                    {isColumnVisible('closestBooking') && (
                      <div className="cell-column">
                        {item.closestBooking || '-'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}

export default MenuTableEnhanced;
