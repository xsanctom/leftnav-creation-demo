import React, { useState } from 'react';
import './BulkEditParameterModal.css';

const BASIC_PARAMETERS = [
  {
    id: 'status',
    label: 'Status',
    description: 'Change visibility status (Online, Hidden, Manager Only, Disabled)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    )
  },
  {
    id: 'tagline',
    label: 'Tagline',
    description: 'Update the tagline text',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    )
  },
  {
    id: 'description',
    label: 'Description',
    description: 'Update the detailed description',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <line x1="10" y1="9" x2="8" y2="9"></line>
        <line x1="16" y1="21" x2="8" y2="21"></line>
      </svg>
    )
  },
  {
    id: 'onlineCategory',
    label: 'Online Category',
    description: 'Change the online category grouping',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    )
  },
  {
    id: 'internalCategory',
    label: 'Internal Category',
    description: 'Change the internal category grouping',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    )
  },
  {
    id: 'days',
    label: 'Days',
    description: 'Update available days of the week',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    )
  },
  {
    id: 'meals',
    label: 'Meal Periods',
    description: 'Update available meal periods',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
      </svg>
    )
  },
  {
    id: 'price',
    label: 'Price',
    description: 'Set a new price for all selected items',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    )
  }
];

const BOOKING_RULES_PARAMETERS = [
  {
    id: 'duration',
    label: 'Duration',
    description: 'Set booking duration for this item',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    )
  },
  {
    id: 'quantityLimit',
    label: 'Quantity Limit',
    description: 'Set a daily inventory limit',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="9" x2="15" y2="15"></line>
        <line x1="15" y1="9" x2="9" y2="15"></line>
      </svg>
    )
  },
  {
    id: 'orderRules',
    label: 'Order Rules',
    description: 'Set minimum and maximum order quantities',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </svg>
    )
  },
  {
    id: 'furthestBooking',
    label: 'Furthest Booking',
    description: 'Set how far in advance bookings can be made',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <polyline points="12 14 16 18 12 22"></polyline>
      </svg>
    )
  },
  {
    id: 'closestBooking',
    label: 'Closest Booking',
    description: 'Set minimum advance notice required',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <polyline points="12 14 8 18 12 22"></polyline>
      </svg>
    )
  },
  {
    id: 'extendToMealEnd',
    label: 'Single Seating Per Meal',
    description: 'Enable single seating per meal period',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
      </svg>
    )
  },
  {
    id: 'showDates',
    label: 'Show Dates',
    description: 'Control when item appears on booking form',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    )
  },
  {
    id: 'validPeriod',
    label: 'Valid Period',
    description: 'Control when item can actually be booked',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <circle cx="12" cy="15" r="1"></circle>
      </svg>
    )
  },
  {
    id: 'turnovers',
    label: 'Turnovers',
    description: 'Set fixed seating times',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
        <polyline points="8 12 12 12 8 18"></polyline>
      </svg>
    )
  },
  {
    id: 'enabledLanguages',
    label: 'Enabled Languages',
    description: 'Control which languages can see this item',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    )
  },
  {
    id: 'tableTiers',
    label: 'Table Tiers',
    description: 'Set available table quality tiers',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    )
  }
];

function BulkEditParameterModal({ isOpen, onClose, selectedCount, onSelectParameter }) {
  const [activeTab, setActiveTab] = useState('basic');

  if (!isOpen) return null;

  return (
    <div className="bulk-edit-modal-overlay" onClick={onClose}>
      <div className="bulk-edit-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bulk-edit-modal-header">
          <div className="bulk-edit-modal-header-left">
            <button className="bulk-edit-modal-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h2 className="bulk-edit-modal-title">Bulk Edit</h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="bulk-edit-modal-tabs">
          <button
            className={`bulk-edit-tab ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic
          </button>
          <button
            className={`bulk-edit-tab ${activeTab === 'booking-rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('booking-rules')}
          >
            Booking Rules
          </button>
        </div>

        {/* Body */}
        <div className="bulk-edit-modal-body">
          <div className="selected-items-info">
            <p>{selectedCount} item{selectedCount > 1 ? 's' : ''} selected</p>
          </div>

          <div className="parameter-selection">
            <h3>Select parameter to edit</h3>
            <div className="parameter-grid">
              {(activeTab === 'basic' ? BASIC_PARAMETERS : BOOKING_RULES_PARAMETERS).map((param) => (
                <button
                  key={param.id}
                  className="parameter-option"
                  onClick={() => onSelectParameter(param.id)}
                >
                  <div className="parameter-icon">{param.icon}</div>
                  <div className="parameter-content">
                    <div className="parameter-label">{param.label}</div>
                    <div className="parameter-description">{param.description}</div>
                  </div>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className="parameter-arrow"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkEditParameterModal;

