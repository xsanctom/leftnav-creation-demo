import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { getIconUrl } from '../utils/iconUtils';

function Sidebar() {
  const { navigationData, expandedGroups, toggleGroup } = useNavigation();
  const [venueDropdownOpen, setVenueDropdownOpen] = useState(false);
  const [venueSearchQuery, setVenueSearchQuery] = useState('');
  const [currentVenue, setCurrentVenue] = useState('Sakura Tokyo');
  const [searchQuery, setSearchQuery] = useState('');
  const venueDropdownRef = useRef(null);

  const venues = [
    { name: 'Sakura Tokyo', location: 'Tokyo, Japan', status: 'Current' },
    { name: 'Sakura Shibuya', location: 'Tokyo, Japan', status: 'Active' },
    { name: 'Sakura Shinjuku', location: 'Tokyo, Japan', status: 'Active' },
    { name: 'Sakura Ginza', location: 'Tokyo, Japan', status: 'Active' },
    { name: 'Sakura Roppongi', location: 'Tokyo, Japan', status: 'Active' },
    { name: 'Sakura Harajuku', location: 'Tokyo, Japan', status: 'Active' },
    { name: 'Sakura Osaka', location: 'Osaka, Japan', status: 'Active' },
    { name: 'Sakura Kyoto', location: 'Kyoto, Japan', status: 'Active' },
    { name: 'Sakura Yokohama', location: 'Yokohama, Japan', status: 'Active' },
    { name: 'Sakura Fukuoka', location: 'Fukuoka, Japan', status: 'Active' },
    { name: 'Sakura Sapporo', location: 'Sapporo, Japan', status: 'Active' },
    { name: 'Sakura Nagoya', location: 'Nagoya, Japan', status: 'Active' },
    { name: 'Sakura Sendai', location: 'Sendai, Japan', status: 'Active' },
  ];

  // Filter venues based on search query
  const filteredVenues = venues.filter(venue => {
    const query = venueSearchQuery.toLowerCase();
    return venue.name.toLowerCase().includes(query) || venue.location.toLowerCase().includes(query);
  });

  // Handle outside click for venue dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (venueDropdownRef.current && !venueDropdownRef.current.contains(event.target)) {
        setVenueDropdownOpen(false);
      }
    };

    if (venueDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [venueDropdownOpen]);

  // Render icon from file path or SVG string
  const renderIcon = (iconValue) => {
    if (!iconValue) return null;
    
    // If it's a file path (contains .svg or /), render as image
    if (iconValue.includes('.svg') || iconValue.includes('/')) {
      // Extract just the filename if it's a full path
      const fileName = iconValue.includes('/') 
        ? iconValue.split('/').pop() 
        : iconValue;
      
      const iconUrl = getIconUrl(fileName);
      
      if (!iconUrl) {
        // Fallback to SVG string rendering if icon not found
        return null;
      }
      
      return (
        <img 
          src={iconUrl}
          alt=""
          style={{ width: '16px', height: '16px', objectFit: 'contain' }}
          onError={(e) => {
            // Fallback: hide broken image
            e.target.style.display = 'none';
          }}
        />
      );
    }
    
    // Otherwise, treat as SVG string (for backward compatibility)
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" dangerouslySetInnerHTML={{ __html: iconValue }} />
    );
  };

  return (
    <div className="sidebar">
      <div className="sidebar-top-container">
        {/* Venue Selector */}
        <div className="venue-selector-container" ref={venueDropdownRef}>
          <button
            className="venue-selector-button"
            onClick={() => setVenueDropdownOpen(!venueDropdownOpen)}
            aria-expanded={venueDropdownOpen}
          >
            <div className="venue-info">
              <div className="venue-logo">{currentVenue.charAt(0)}</div>
              <div className="venue-details">
                <div className="venue-name">{currentVenue}</div>
              </div>
            </div>
            <svg className="venue-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {venueDropdownOpen && (
            <div className="venue-dropdown">
              <div className="venue-dropdown-content">
                {/* Search Input */}
                <div className="venue-search-container">
                  <input
                    type="text"
                    className="venue-search-input"
                    placeholder="Search venues..."
                    value={venueSearchQuery}
                    onChange={(e) => setVenueSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div className="venue-list">
                  {filteredVenues.length > 0 ? (
                    filteredVenues.map((venue, index) => (
                      <div
                        key={index}
                        className={`venue-option ${venue.name === currentVenue ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentVenue(venue.name);
                          setVenueDropdownOpen(false);
                        }}
                      >
                        <div className="venue-option-info">
                          <div className="venue-option-name">{venue.name}</div>
                          <div className="venue-option-location">{venue.location}</div>
                        </div>
                        {venue.status === 'Current' && (
                          <div className="venue-option-status">{venue.status}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="venue-no-matches">
                      No venues found
                    </div>
                  )}
                </div>
                <div className="venue-settings">
                  <button className="venue-settings-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                    </svg>
                    Venue Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Search (⌘+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Home - Always at top */}
        {navigationData.home && (
          <a href={navigationData.home.link || '#'} className="nav-item">
            {renderIcon(navigationData.home.icon)}
            {navigationData.home.label}
          </a>
        )}

        {/* Sections */}
        {navigationData.sections.map((section) => (
          <React.Fragment key={section.id}>
            <div className="nav-section-header">{section.name}</div>
            
            {section.items.map((item) => {
              if (item.type === 'group') {
                const isExpanded = expandedGroups[item.id] || false;
                return (
                  <React.Fragment key={item.id}>
                    <div 
                      className="nav-item nav-item-expandable" 
                      onClick={() => toggleGroup(item.id)}
                    >
                      {item.badge ? (
                        <span className="nav-badge">{item.badge}</span>
                      ) : (
                        renderIcon(item.icon)
                      )}
                      {item.label}
                      <svg 
                        className={`nav-chevron ${isExpanded ? 'expanded' : ''}`} 
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                    {isExpanded && item.children && (
                      <div className="nav-submenu">
                        {item.children.map((child) => (
                          <a 
                            key={child.id} 
                            href={child.link || '#'} 
                            className="nav-item nav-subitem"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                );
              } else {
                // Main item
                return (
                  <a 
                    key={item.id} 
                    href={item.link || '#'} 
                    className={`nav-item ${item.active ? 'active' : ''}`}
                  >
                    {renderIcon(item.icon)}
                    {item.label}
                  </a>
                );
              }
            })}
          </React.Fragment>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="help-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          Help
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
