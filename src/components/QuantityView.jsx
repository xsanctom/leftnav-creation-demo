import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMenu } from '../context/MenuContext';

function QuantityView() {
  const { state } = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStartDate, setCurrentStartDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [visibleDays, setVisibleDays] = useState(7);
  const [badgePositions, setBadgePositions] = useState([]);
  
  const headerCellRefs = useRef({});
  const quantityViewRef = useRef(null);
  const tableWrapperRef = useRef(null);

  const calculateVisibleDays = () => {
    const viewportWidth = window.innerWidth;
    // Viewport minus sidebar (240px) minus padding/margins
    const availableWidth = viewportWidth - 520;
    const columnWidth = 60;
    const possibleColumns = Math.floor(availableWidth / columnWidth);
    
    if (possibleColumns >= 28) return 28;
    if (possibleColumns >= 21) return 21;
    if (possibleColumns >= 14) return 14;
    return 7;
  };

  useEffect(() => {
    const handleResize = () => {
      setVisibleDays(calculateVisibleDays());
    };

    // Set initial visible days
    setVisibleDays(calculateVisibleDays());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrevPeriod = () => {
    const newDate = new Date(currentStartDate);
    newDate.setDate(newDate.getDate() - visibleDays);
    setCurrentStartDate(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(currentStartDate);
    newDate.setDate(newDate.getDate() + visibleDays);
    setCurrentStartDate(newDate);
  };

  const generateDateColumns = () => {
    const columns = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let previousMonth = currentStartDate.getMonth();

    for (let i = 0; i < visibleDays; i++) {
      const date = new Date(currentStartDate);
      date.setDate(date.getDate() + i);
      
      const dayOfWeek = date.getDay();
      const dayNames = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
      const dayName = dayNames[dayOfWeek];
      const dayNum = date.getDate();
      
      const isToday = date.getTime() === today.getTime();
      const isSaturday = dayOfWeek === 6;
      const isSunday = dayOfWeek === 0;
      
      const currentMonth = date.getMonth();
      const isNewMonth = i > 0 && currentMonth !== previousMonth;
      previousMonth = currentMonth;

      columns.push({
        date,
        dayNum,
        dayName,
        isToday,
        isSaturday,
        isSunday,
        isNewMonth,
        monthName: isNewMonth ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][currentMonth] : null
      });
    }

    return columns;
  };

  const getMonthLabel = () => {
    const endDate = new Date(currentStartDate);
    endDate.setDate(endDate.getDate() + visibleDays - 1);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (currentStartDate.getMonth() === endDate.getMonth()) {
      return `${monthNames[currentStartDate.getMonth()]} ${currentStartDate.getFullYear()}`;
    } else {
      return `${monthNames[currentStartDate.getMonth()]} - ${monthNames[endDate.getMonth()]} ${endDate.getFullYear()}`;
    }
  };

  const dateColumns = generateDateColumns();
  
  const filteredItems = state.menuItems.filter(item => {
    if (!searchQuery) return true;
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate badge positions for portal rendering
  const calculateBadgePositions = useCallback(() => {
    if (!quantityViewRef.current || !tableWrapperRef.current) return;
    
    // Generate current visible dates to filter refs
    const visibleDates = new Set();
    for (let i = 0; i < visibleDays; i++) {
      const date = new Date(currentStartDate);
      date.setDate(date.getDate() + i);
      visibleDates.add(date.toISOString());
    }
    
    const viewRect = quantityViewRef.current.getBoundingClientRect();
    const positions = [];
    
    Object.entries(headerCellRefs.current).forEach(([key, cellRef]) => {
      if (!cellRef) return;
      
      // Extract date from key (format: "today-2024-01-15T00:00:00.000Z" or "month-2024-01-15T00:00:00.000Z")
      const dateMatch = key.match(/(today|month)-(.*)/);
      if (!dateMatch) return;
      
      const dateISO = dateMatch[2];
      // Only process refs for currently visible dates
      if (!visibleDates.has(dateISO)) return;
      
      const cellRect = cellRef.getBoundingClientRect();
      const top = cellRect.top - viewRect.top - 8; // -8px to position above
      const left = cellRect.left - viewRect.left + (cellRect.width / 2); // Center horizontally
      
      positions.push({
        key,
        top,
        left,
        type: key.startsWith('today') ? 'today' : 'month',
        text: key.startsWith('today') ? 'Today' : cellRef.dataset.monthName
      });
    });
    
    setBadgePositions(positions);
  }, [currentStartDate, visibleDays]);

  // Update badge positions on mount, scroll, resize, and date changes
  useEffect(() => {
    // Use double RAF to ensure DOM is fully updated AND refs are assigned before calculating positions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        calculateBadgePositions();
      });
    });
    
    const tableWrapper = tableWrapperRef.current;
    if (tableWrapper) {
      tableWrapper.addEventListener('scroll', calculateBadgePositions);
    }
    
    window.addEventListener('resize', calculateBadgePositions);
    
    return () => {
      if (tableWrapper) {
        tableWrapper.removeEventListener('scroll', calculateBadgePositions);
      }
      window.removeEventListener('resize', calculateBadgePositions);
    };
  }, [calculateBadgePositions, currentStartDate, visibleDays, searchQuery]);

  return (
    <div className="quantity-view" ref={quantityViewRef}>
      {/* Quantity Header */}
      <div className="quantity-header">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="calendar-navigation">
          <button className="nav-arrow" onClick={handlePrevPeriod}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <span className="calendar-month">{getMonthLabel()}</span>
          <button className="nav-arrow" onClick={handleNextPeriod}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* Quantity Calendar Table */}
      <div className="quantity-table-wrapper" ref={tableWrapperRef}>
        <table className="quantity-calendar-table">
          <thead>
            <tr>
              <th className="fixed-col">Name</th>
              <th className="fixed-col">Qty per day</th>
              {dateColumns.map((col, idx) => {
                let className = 'date-col';
                if (col.isSaturday) className += ' saturday';
                if (col.isSunday) className += ' sunday';
                if (col.isToday) className += ' today';
                if (col.isNewMonth) className += ' new-month';
                
                // Store ref for cells with badges
                const needsRef = col.isToday || col.isNewMonth;
                // Use date-based keys to prevent collisions when navigating
                const refKey = col.isToday 
                  ? `today-${col.date.toISOString()}` 
                  : col.isNewMonth 
                    ? `month-${col.date.toISOString()}` 
                    : null;
                
                return (
                  <th 
                    key={idx} 
                    className={className}
                    ref={needsRef ? (el) => {
                      if (el) {
                        headerCellRefs.current[refKey] = el;
                        if (col.isNewMonth) {
                          el.dataset.monthName = col.monthName;
                        }
                      } else {
                        // Cleanup on unmount
                        delete headerCellRefs.current[refKey];
                      }
                    } : null}
                  >
                    {col.dayNum}<br />{col.dayName}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td className="fixed-col item-name">
                  <span>{item.name}</span>
                  <button className="item-menu">⋯</button>
                </td>
                <td className="fixed-col">
                  <input type="number" min="0" />
                </td>
                {dateColumns.map((col, idx) => {
                  let className = 'date-cell';
                  if (col.isSaturday) className += ' saturday';
                  if (col.isSunday) className += ' sunday';
                  
                  return (
                    <td key={idx} className={className}>
                      <input type="number" min="0" />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Portal badges - rendered outside scrollable container */}
      {badgePositions.map((badge) => (
        <div
          key={badge.key}
          className={badge.type === 'today' ? 'today-badge-portal' : 'month-badge-portal'}
          style={{
            top: `${badge.top}px`,
            left: `${badge.left}px`,
          }}
        >
          {badge.text}
        </div>
      ))}
    </div>
  );
}

export default QuantityView;

