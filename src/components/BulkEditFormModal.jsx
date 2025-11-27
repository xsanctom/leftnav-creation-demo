import React, { useState } from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';
import StarRatingSelector from './StarRatingSelector';
import DatePickerInput from './DatePickerInput';
import TimePickerInput from './TimePickerInput';
import './BulkEditFormModal.css';

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['Breakfast', 'Lunch', 'Tea', 'Dinner', 'Late'];
const CATEGORIES = ['Courses', 'Appetizers', 'Main Courses', 'Desserts', 'Beverages', 'Specials'];
const STATUS_OPTIONS = ['Online', 'Hidden', 'Manager Only', 'Disabled'];
const DURATION_OPTIONS = [
  { value: null, label: 'Use venue default' },
  { value: '30m', label: '30 minutes' },
  { value: '1hr', label: '1 hour' },
  { value: '1.5hr', label: '1.5 hours' },
  { value: '2hr', label: '2 hours' },
  { value: '2.5hr', label: '2.5 hours' },
  { value: '3hr', label: '3 hours' },
  { value: '4hr', label: '4 hours' }
];
const ORDER_OPTIONS = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10+' }
];
const MAX_ORDER_OPTIONS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: null, label: 'Unlimited' }
];
const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ar', label: 'Arabic' },
  { value: 'th', label: 'Thai' }
];

function BulkEditFormModal({ 
  isOpen, 
  onClose, 
  onBack,
  selectedParameter, 
  selectedItemIds, 
  onSave 
}) {
  const [formData, setFormData] = useState({
    status: 'Online',
    onlineCategory: 'Courses',
    internalCategory: 'Courses',
    days: [],
    meals: [],
    price: '',
    tagline: '',
    description: '',
    duration: null,
    quantityLimit: '',
    orderRules: {
      minOrder: 0,
      maxOrder: null
    },
    furthestBooking: {
      mode: 'daily',
      number: 2,
      unit: 'months'
    },
    closestBooking: {
      mode: 'advance',
      timeIncrement: 60,
      days: 1
    },
    extendToMealEnd: false,
    showDates: [],
    showStartTime: null,
    validPeriod: {
      dateRanges: [],
      startTime: null,
      endTime: null
    },
    turnovers: [],
    enabledLanguages: [],
    tableTiers: []
  });

  if (!isOpen || !selectedParameter) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleToggleMeal = (meal) => {
    setFormData(prev => ({
      ...prev,
      meals: prev.meals.includes(meal)
        ? prev.meals.filter(m => m !== meal)
        : [...prev.meals, meal]
    }));
  };

  const handleOrderRulesChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      orderRules: { ...prev.orderRules, [field]: value }
    }));
  };

  const handleSave = () => {
    let updates = {};

    switch (selectedParameter) {
      case 'status':
        updates = { status: formData.status };
        break;
      case 'onlineCategory':
        updates = { category: formData.onlineCategory };
        break;
      case 'internalCategory':
        updates = { internalCategory: formData.internalCategory };
        break;
      case 'days':
        if (formData.days.length === 0) {
          alert('Please select at least one day');
          return;
        }
        updates = { days: formData.days };
        break;
      case 'meals':
        updates = { meals: formData.meals };
        break;
      case 'price':
        const price = parseFloat(formData.price);
        if (isNaN(price) || price < 0) {
          alert('Please enter a valid price');
          return;
        }
        updates = { price: price };
        break;
      case 'tagline':
        updates = { tagline: formData.tagline };
        break;
      case 'description':
        updates = { description: formData.description };
        break;
      case 'duration':
        updates = { 
          bookingRules: { 
            duration: { 
              value: formData.duration, 
              extendToMealPeriod: false 
            } 
          } 
        };
        break;
      case 'quantityLimit':
        const quantityLimit = formData.quantityLimit ? parseInt(formData.quantityLimit) : null;
        if (formData.quantityLimit && (isNaN(quantityLimit) || quantityLimit < 1)) {
          alert('Please enter a valid quantity limit (minimum 1)');
          return;
        }
        updates = { 
          bookingRules: { quantityLimit: quantityLimit } 
        };
        break;
      case 'orderRules':
        if (formData.orderRules.minOrder > formData.orderRules.maxOrder && formData.orderRules.maxOrder !== null) {
          alert('Minimum order cannot exceed maximum order');
          return;
        }
        updates = { 
          bookingRules: { 
            orderRules: {
              minOrder: formData.orderRules.minOrder,
              maxOrder: formData.orderRules.maxOrder,
              oneOrderPerPerson: false
            }
          } 
        };
        break;
      case 'enabledLanguages':
        updates = { 
          bookingRules: { enabledLanguages: formData.enabledLanguages } 
        };
        break;
      case 'tableTiers':
        updates = { 
          bookingRules: { tableTiers: formData.tableTiers } 
        };
        break;
      case 'furthestBooking':
        updates = { 
          bookingRules: { furthestBooking: formData.furthestBooking } 
        };
        break;
      case 'closestBooking':
        updates = { 
          bookingRules: { closestBooking: formData.closestBooking } 
        };
        break;
      case 'extendToMealEnd':
        updates = { 
          bookingRules: { extendToMealEnd: formData.extendToMealEnd } 
        };
        break;
      case 'showDates':
        updates = { 
          bookingRules: { 
            showDates: formData.showDates,
            showStartTime: formData.showStartTime
          } 
        };
        break;
      case 'validPeriod':
        updates = { 
          bookingRules: { validPeriod: formData.validPeriod } 
        };
        break;
      case 'turnovers':
        updates = { 
          bookingRules: { turnovers: formData.turnovers } 
        };
        break;
      default:
        return;
    }

    onSave(selectedItemIds, updates);
  };

  const getParameterLabel = () => {
    const labels = {
      status: 'Status',
      onlineCategory: 'Online Category',
      internalCategory: 'Internal Category',
      days: 'Days',
      meals: 'Meal Periods',
      price: 'Price',
      tagline: 'Tagline',
      description: 'Description',
      duration: 'Duration',
      quantityLimit: 'Quantity Limit',
      orderRules: 'Order Rules',
      furthestBooking: 'Furthest Booking',
      closestBooking: 'Closest Booking',
      extendToMealEnd: 'Single Seating Per Meal',
      showDates: 'Show Dates',
      validPeriod: 'Valid Period',
      turnovers: 'Turnovers',
      enabledLanguages: 'Enabled Languages',
      tableTiers: 'Table Tiers'
    };
    return labels[selectedParameter] || selectedParameter;
  };

  const renderFormField = () => {
    switch (selectedParameter) {
      case 'status':
        return (
          <div className="form-field">
            <div className="form-label-group">
              <label className="form-label">Status</label>
            </div>
            <select
              className="edit-select"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        );

      case 'onlineCategory':
        return (
          <div className="form-field">
            <div className="form-label-group">
              <label className="form-label">Online Category</label>
              <p className="edit-sublabel">Guest-facing category</p>
            </div>
            <select
              className="edit-select"
              value={formData.onlineCategory}
              onChange={(e) => handleInputChange('onlineCategory', e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        );

      case 'internalCategory':
        return (
          <div className="form-field">
            <div className="form-label-group">
              <label className="form-label">Internal Category</label>
              <p className="edit-sublabel">Internal-only category</p>
            </div>
            <select
              className="edit-select"
              value={formData.internalCategory}
              onChange={(e) => handleInputChange('internalCategory', e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        );

      case 'days':
        return (
          <div className="form-field">
            <label className="form-label">Days</label>
            <div className="edit-toggle-group">
              {DAY_LABELS.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  className={`edit-toggle-button ${formData.days.includes(day) ? 'active' : ''}`}
                  onClick={() => handleToggleDay(day)}
                >
                  {['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'][index]}
                </button>
              ))}
            </div>
          </div>
        );

      case 'meals':
        return (
          <div className="form-field">
            <label className="form-label">Meal Periods</label>
            <div className="edit-toggle-group">
              {MEALS.map(meal => (
                <button
                  key={meal}
                  type="button"
                  className={`edit-toggle-button ${formData.meals.includes(meal) ? 'active' : ''}`}
                  onClick={() => handleToggleMeal(meal)}
                >
                  {meal}
                </button>
              ))}
            </div>
          </div>
        );

      case 'price':
        return (
          <div className="form-field">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="edit-input"
              placeholder="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        );

      case 'tagline':
        return (
          <div className="form-field">
            <label className="form-label">Tagline</label>
            <input
              type="text"
              className="edit-input"
              placeholder="Enter tagline"
              value={formData.tagline}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
            />
          </div>
        );

      case 'description':
        return (
          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea
              className="edit-textarea"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
            />
          </div>
        );

      case 'duration':
        return (
          <div className="form-field">
            <div className="form-label-group">
              <label className="form-label">Duration</label>
              <p className="form-help-text">Set a booking duration specific to this item. This will override default venue settings.</p>
            </div>
            <select
              className="edit-select"
              value={formData.duration || ''}
              onChange={(e) => handleInputChange('duration', e.target.value || null)}
            >
              {DURATION_OPTIONS.map(option => (
                <option key={option.value || 'default'} value={option.value || ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'quantityLimit':
        return (
          <div className="form-field">
            <div className="form-label-group">
              <label className="form-label">Quantity Limit</label>
              <p className="form-help-text">Set a limited inventory for this item per day.</p>
            </div>
            <input
              type="number"
              className="edit-input"
              placeholder="No limit"
              value={formData.quantityLimit}
              onChange={(e) => handleInputChange('quantityLimit', e.target.value)}
              min="1"
            />
          </div>
        );

      case 'orderRules':
        return (
          <div className="form-field">
            <div className="form-label-group">
              <label className="form-label">Order Rules</label>
              <p className="form-help-text">Set a minimum/maximum quantity of this item allowed per booking.</p>
            </div>
            <div className="edit-field-row">
              <div className="edit-field">
                <label className="edit-sublabel">Min order</label>
                <select
                  className="edit-select"
                  value={formData.orderRules.minOrder}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    orderRules: { ...prev.orderRules, minOrder: parseInt(e.target.value) }
                  }))}
                >
                  {ORDER_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="edit-field">
                <label className="edit-sublabel">Max order</label>
                <select
                  className="edit-select"
                  value={formData.orderRules.maxOrder || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    orderRules: { ...prev.orderRules, maxOrder: e.target.value ? parseInt(e.target.value) : null }
                  }))}
                >
                  {MAX_ORDER_OPTIONS.map(option => (
                    <option key={option.value || 'unlimited'} value={option.value || ''}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 'enabledLanguages':
        return (
          <div className="form-field">
            <div className="form-label-group">
              <label className="form-label">Enabled Languages</label>
              <p className="form-help-text">Item only shown to guests using selected languages</p>
            </div>
            <div style={{ marginTop: '8px' }}>
              <MultiSelectDropdown
                options={LANGUAGES}
                value={formData.enabledLanguages}
                onChange={(value) => handleInputChange('enabledLanguages', value)}
                placeholder="Select languages"
                searchable={true}
                showSelectAll={true}
              />
            </div>
          </div>
        );

      case 'tableTiers':
        return (
          <div className="form-field">
            <div className="form-label-group">
              <label className="form-label">Table Tiers</label>
              <p className="form-help-text">Item available only for specific table quality tiers</p>
            </div>
            <StarRatingSelector
              value={formData.tableTiers}
              onChange={(value) => handleInputChange('tableTiers', value)}
              maxStars={5}
              multiple={true}
            />
          </div>
        );

      case 'furthestBooking':
        return (
          <div className="config-section">
            <div className="config-section-header">
              <label className="form-label">Furthest Booking</label>
              <p className="form-help-text">How far ahead can guests book?</p>
            </div>
            <div className="radio-options">
              <label className={`radio-option ${formData.furthestBooking.mode === 'daily' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="furthest-type" 
                  value="daily"
                  checked={formData.furthestBooking.mode === 'daily'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    furthestBooking: { ...prev.furthestBooking, mode: e.target.value }
                  }))}
                />
                <div className="radio-content">
                  <span className="radio-label">Update Daily</span>
                  <span className="radio-description">New days become available each day.</span>
                </div>
              </label>
              <label className={`radio-option ${formData.furthestBooking.mode === 'monthly' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="furthest-type" 
                  value="monthly"
                  checked={formData.furthestBooking.mode === 'monthly'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    furthestBooking: { ...prev.furthestBooking, mode: e.target.value }
                  }))}
                />
                <div className="radio-content">
                  <span className="radio-label">Update Monthly</span>
                  <span className="radio-description">Full months unlock on the 1st of each month.</span>
                </div>
              </label>
            </div>
            {formData.furthestBooking.mode === 'daily' && (
              <div className="edit-field-row">
                <div className="edit-field">
                  <input
                    type="number"
                    className="edit-input"
                    min="1"
                    max="999"
                    value={formData.furthestBooking.number || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      furthestBooking: { ...prev.furthestBooking, number: parseInt(e.target.value) || 1 }
                    }))}
                    placeholder="2"
                  />
                </div>
                <div className="edit-field">
                  <select
                    className="edit-select"
                    value={formData.furthestBooking.unit}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      furthestBooking: { ...prev.furthestBooking, unit: e.target.value }
                    }))}
                  >
                    <option value="months">Months</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
            )}
            {formData.furthestBooking.mode === 'monthly' && (
              <div className="edit-field-row">
                <div className="edit-field">
                  <input
                    type="number"
                    className="edit-input"
                    min="1"
                    max="999"
                    value={formData.furthestBooking.number || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      furthestBooking: { ...prev.furthestBooking, number: parseInt(e.target.value) || 1 }
                    }))}
                    placeholder="2"
                  />
                </div>
                <div className="edit-field">
                  <span className="input-label">Months</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'closestBooking':
        return (
          <div className="config-section">
            <div className="config-section-header">
              <label className="form-label">Closest Booking</label>
              <p className="form-help-text">What's the minimum advance notice required?</p>
            </div>
            <div className="radio-options">
              <label className={`radio-option ${formData.closestBooking.mode === 'same-day' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="closest-type" 
                  value="same-day"
                  checked={formData.closestBooking.mode === 'same-day'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    closestBooking: { ...prev.closestBooking, mode: e.target.value }
                  }))}
                />
                <div className="radio-content">
                  <span className="radio-label">Same-Day Booking</span>
                  <span className="radio-description">Accept bookings with short notice.</span>
                </div>
              </label>
              <label className={`radio-option ${formData.closestBooking.mode === 'advance' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="closest-type" 
                  value="advance"
                  checked={formData.closestBooking.mode === 'advance'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    closestBooking: { ...prev.closestBooking, mode: e.target.value }
                  }))}
                />
                <div className="radio-content">
                  <span className="radio-label">Advance Booking</span>
                  <span className="radio-description">Require booking days in advance.</span>
                </div>
              </label>
            </div>
            {formData.closestBooking.mode === 'same-day' && (
              <div className="edit-field-row">
                <div className="edit-field">
                  <select
                    className="edit-select"
                    value={formData.closestBooking.timeIncrement}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      closestBooking: { ...prev.closestBooking, timeIncrement: parseInt(e.target.value) }
                    }))}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                    <option value="240">4 hours</option>
                    <option value="300">5 hours</option>
                    <option value="360">6 hours</option>
                    <option value="420">7 hours</option>
                    <option value="480">8 hours</option>
                    <option value="540">9 hours</option>
                    <option value="600">10 hours</option>
                    <option value="660">11 hours</option>
                    <option value="720">12 hours</option>
                    <option value="1080">18 hours</option>
                  </select>
                </div>
              </div>
            )}
            {formData.closestBooking.mode === 'advance' && (
              <div className="edit-field-row">
                <div className="edit-field">
                  <input
                    type="number"
                    className="edit-input"
                    min="1"
                    max="999"
                    value={formData.closestBooking.days || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      closestBooking: { ...prev.closestBooking, days: parseInt(e.target.value) || 1 }
                    }))}
                    placeholder="1"
                  />
                </div>
                <div className="edit-field">
                  <span className="input-label">Days</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'extendToMealEnd':
        return (
          <div className="form-field">
            <div className="meal-period-container">
              <div className="edit-checkbox">
                <input
                  type="checkbox"
                  id="extendToMealEnd"
                  checked={formData.extendToMealEnd}
                  onChange={(e) => handleInputChange('extendToMealEnd', e.target.checked)}
                />
                <label htmlFor="extendToMealEnd" className="meal-period-label">Single seating per meal period</label>
              </div>
              <p className="form-help-text meal-period-description">Enable this if each meal period should only have a single seating with no table turnovers.</p>
            </div>
          </div>
        );

      case 'showDates':
        return (
          <div className="availability-container">
            <div className="form-field">
              <div className="form-label-group">
                <label className="form-label">Show Dates (Visibility)</label>
                <p className="form-help-text">Controls when item appears on booking form. If not configured, item is always visible.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {formData.showDates.map((range, index) => (
                  <div key={index} className="edit-field-row flush-row">
                    <div className="edit-field">
                      <DatePickerInput
                        value={range.startDate}
                        onChange={(value) => {
                          const newShowDates = [...formData.showDates];
                          newShowDates[index] = { ...newShowDates[index], startDate: value };
                          handleInputChange('showDates', newShowDates);
                        }}
                        placeholder="Start date"
                      />
                    </div>
                    <div className="edit-field">
                      <DatePickerInput
                        value={range.endDate}
                        onChange={(value) => {
                          const newShowDates = [...formData.showDates];
                          newShowDates[index] = { ...newShowDates[index], endDate: value };
                          handleInputChange('showDates', newShowDates);
                        }}
                        placeholder="End date"
                      />
                    </div>
                    <div className="edit-field" style={{ flex: '0 0 auto', width: '40px' }}>
                      <button
                        type="button"
                        className="booking-rules-delete-btn"
                        onClick={() => {
                          handleInputChange('showDates', formData.showDates.filter((_, i) => i !== index));
                        }}
                        title="Delete date range"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    handleInputChange('showDates', [...formData.showDates, { startDate: '', endDate: '' }]);
                  }}
                  className="edit-inline-button"
                >
                  + Add dates
                </button>
              </div>
            </div>
            {formData.showDates.length > 0 && (
              <>
                <div className="form-divider"></div>
                <div className="form-field">
                  <label className="form-label">Show Start Time</label>
                  <p className="form-help-text">Controls when item appears on booking form</p>
                  <TimePickerInput
                    value={formData.showStartTime}
                    onChange={(value) => handleInputChange('showStartTime', value)}
                    placeholder="09:00"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'validPeriod':
        return (
          <div className="availability-container">
            <div className="form-field">
              <div className="form-label-group">
                <label className="form-label">Valid Dates (Purchasability)</label>
                <p className="form-help-text">Controls when item can actually be booked. If not configured, item is always purchasable when visible.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {formData.validPeriod.dateRanges.map((range, index) => (
                  <div key={index} className="edit-field-row flush-row">
                    <div className="edit-field">
                      <DatePickerInput
                        value={range.startDate}
                        onChange={(value) => {
                          const newDateRanges = [...formData.validPeriod.dateRanges];
                          newDateRanges[index] = { ...newDateRanges[index], startDate: value };
                          handleInputChange('validPeriod', { ...formData.validPeriod, dateRanges: newDateRanges });
                        }}
                        placeholder="Start date"
                      />
                    </div>
                    <div className="edit-field">
                      <DatePickerInput
                        value={range.endDate}
                        onChange={(value) => {
                          const newDateRanges = [...formData.validPeriod.dateRanges];
                          newDateRanges[index] = { ...newDateRanges[index], endDate: value };
                          handleInputChange('validPeriod', { ...formData.validPeriod, dateRanges: newDateRanges });
                        }}
                        placeholder="End date"
                      />
                    </div>
                    <div className="edit-field" style={{ flex: '0 0 auto', width: '40px' }}>
                      <button
                        type="button"
                        className="booking-rules-delete-btn"
                        onClick={() => {
                          handleInputChange('validPeriod', {
                            ...formData.validPeriod,
                            dateRanges: formData.validPeriod.dateRanges.filter((_, i) => i !== index)
                          });
                        }}
                        title="Delete date range"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    handleInputChange('validPeriod', {
                      ...formData.validPeriod,
                      dateRanges: [...formData.validPeriod.dateRanges, { startDate: '', endDate: '' }]
                    });
                  }}
                  className="edit-inline-button"
                >
                  + Add dates
                </button>
              </div>
            </div>
            {formData.validPeriod.dateRanges.length > 0 && (
              <>
                <div className="form-divider"></div>
                <div className="form-field">
                  <label className="form-label">Valid Times</label>
                  <p className="form-help-text">Time range that applies to all date ranges above</p>
                  <div className="edit-field-row">
                    <div className="edit-field">
                      <TimePickerInput
                        value={formData.validPeriod.startTime}
                        onChange={(value) => handleInputChange('validPeriod', {
                          ...formData.validPeriod,
                          startTime: value
                        })}
                        placeholder="Start time"
                      />
                    </div>
                    <div className="edit-field">
                      <TimePickerInput
                        value={formData.validPeriod.endTime}
                        onChange={(value) => handleInputChange('validPeriod', {
                          ...formData.validPeriod,
                          endTime: value
                        })}
                        placeholder="End time"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'turnovers':
        return (
          <div className="form-field">
            <div className="form-label-group">
              <label className="form-label">Turnovers</label>
              <p className="form-help-text">Fixed seating times for this menu item</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {formData.turnovers.map((turnover, index) => (
                <div key={index} className="booking-rules-row">
                  <div className="edit-field-row">
                    <div className="edit-field">
                      <label className="edit-sublabel">Start time (required)</label>
                      <TimePickerInput
                        value={turnover.startTime}
                        onChange={(value) => {
                          const newTurnovers = [...formData.turnovers];
                          newTurnovers[index] = { ...newTurnovers[index], startTime: value };
                          handleInputChange('turnovers', newTurnovers);
                        }}
                        placeholder="09:00"
                      />
                    </div>
                    <div className="edit-field">
                      <label className="edit-sublabel">Latest start (optional)</label>
                      <TimePickerInput
                        value={turnover.latestStart}
                        onChange={(value) => {
                          const newTurnovers = [...formData.turnovers];
                          newTurnovers[index] = { ...newTurnovers[index], latestStart: value };
                          handleInputChange('turnovers', newTurnovers);
                        }}
                        placeholder="09:30"
                      />
                    </div>
                    <div className="edit-field">
                      <label className="edit-sublabel">End time (optional)</label>
                      <TimePickerInput
                        value={turnover.endTime}
                        onChange={(value) => {
                          const newTurnovers = [...formData.turnovers];
                          newTurnovers[index] = { ...newTurnovers[index], endTime: value };
                          handleInputChange('turnovers', newTurnovers);
                        }}
                        placeholder="11:00"
                      />
                    </div>
                    <div className="edit-field" style={{ flex: '0 0 auto', width: '40px', alignSelf: 'flex-end' }}>
                      <button
                        type="button"
                        className="booking-rules-delete-btn"
                        onClick={() => {
                          handleInputChange('turnovers', formData.turnovers.filter((_, i) => i !== index));
                        }}
                        title="Delete turnover"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  handleInputChange('turnovers', [...formData.turnovers, { startTime: '', latestStart: '', endTime: '' }]);
                }}
                className="edit-inline-button"
              >
                + Add turnover
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bulk-edit-form-modal-overlay" onClick={onClose}>
      <div className="bulk-edit-form-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bulk-edit-form-modal-header">
          <div className="bulk-edit-form-modal-header-left">
            <button className="bulk-edit-form-modal-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            {onBack && (
              <button className="bulk-edit-form-modal-back" onClick={onBack} title="Back to parameter selection">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}
            <h2 className="bulk-edit-form-modal-title">Bulk Edit: {getParameterLabel()}</h2>
          </div>
          <button type="button" className="button primary" onClick={handleSave}>
            Apply to {selectedItemIds.length} item{selectedItemIds.length > 1 ? 's' : ''}
          </button>
        </div>

        {/* Body */}
        <div className="bulk-edit-form-modal-body">
          <div className="selected-items-info">
            <p>{selectedItemIds.length} item{selectedItemIds.length > 1 ? 's' : ''} will be updated</p>
          </div>

          <div className="bulk-edit-form-content">
            {renderFormField()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkEditFormModal;

