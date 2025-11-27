import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import './AddMenuItemsModal.css';

// Predefined options for dropdowns
const CATEGORIES = ['Courses', 'Appetizers', 'Main Courses', 'Desserts', 'Beverages', 'Specials'];
const MEALS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Brunch'];
const DAYS = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STATUSES = ['Online', 'Hidden', 'Manager Only', 'Disabled'];

function AddMenuItemsModal({ onClose }) {
  const { addMenuItems } = useMenu();
  const [rows, setRows] = useState([createEmptyRow()]);
  const [status, setStatus] = useState('Online');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  function createEmptyRow() {
    return {
      id: `temp-${Date.now()}-${Math.random()}`,
      name: '',
      image: null,
      imagePreview: null,
      price: '',
      description: '',
      category: 'Courses',
      meals: 'All',
      days: 'All',
      status: 'Online',
    };
  }

  const addRow = () => {
    setRows([...rows, createEmptyRow()]);
  };

  const addMultipleRows = (count) => {
    const newRows = Array.from({ length: count }, () => createEmptyRow());
    setRows([...rows, ...newRows]);
  };

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const updateRow = (id, field, value) => {
    let finalValue = value;
    
    // Expand "All" to full array of options
    if (field === 'meals' && value === 'All') {
      finalValue = ['Breakfast', 'Lunch', 'Dinner', 'Brunch'];
    }
    if (field === 'days' && value === 'All') {
      finalValue = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    }
    
    setRows(rows.map((row) => (row.id === id ? { ...row, [field]: finalValue } : row)));
  };

  const handleImageUpload = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateRow(id, 'image', file);
        updateRow(id, 'imagePreview', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    // Filter out empty rows
    const validRows = rows.filter((row) => row.name.trim() !== '');
    
    if (validRows.length === 0) {
      alert('Please add at least one menu item with a name.');
      return;
    }

    // Add status to all items and prepare for submission
    const itemsToAdd = validRows.map((row) => ({
      name: row.name,
      image: row.imagePreview, // Store as base64 for demo
      price: parseFloat(row.price) || 0,
      description: row.description,
      category: row.category,
      meals: row.meals,
      days: row.days,
      status: status,
    }));

    addMenuItems(itemsToAdd);
    onClose();
  };

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '1200px',
          width: '90%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>Add Menu Items</h2>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-subtle)' }}>
              Easily create up to 60 menu items at once.
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '500', fontSize: '14px', color: 'var(--text-subtle)' }}>
                    Item Name
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '500', fontSize: '14px', color: 'var(--text-subtle)', width: '100px' }}>
                    Image
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '500', fontSize: '14px', color: 'var(--text-subtle)', width: '100px' }}>
                    Price
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '500', fontSize: '14px', color: 'var(--text-subtle)' }}>
                    Description
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '500', fontSize: '14px', color: 'var(--text-subtle)', width: '140px' }}>
                    Category
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '500', fontSize: '14px', color: 'var(--text-subtle)', width: '120px' }}>
                    Meals
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '500', fontSize: '14px', color: 'var(--text-subtle)', width: '120px' }}>
                    Days
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    {/* Item Name */}
                    <td style={{ padding: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="eg. Chicken Salad"
                        value={row.name}
                        onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                        style={{ width: '100%', minWidth: '150px' }}
                      />
                    </td>

                    {/* Image */}
                    <td style={{ padding: '8px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(row.id, e)}
                          style={{ display: 'none' }}
                          id={`image-${row.id}`}
                        />
                        <label
                          htmlFor={`image-${row.id}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            border: '2px dashed var(--border)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            background: row.imagePreview ? `url(${row.imagePreview})` : 'var(--surface-low)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        >
                          {!row.imagePreview && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-subtle)" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                          )}
                        </label>
                      </div>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '8px' }}>
                      <div style={{ position: 'relative' }}>
                        <span style={{
                          position: 'absolute',
                          left: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--text-subtle)',
                          fontSize: '14px',
                        }}>
                          ¥ 
                        </span>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="0"
                          value={row.price}
                          onChange={(e) => updateRow(row.id, 'price', e.target.value)}
                          style={{ width: '100%', paddingLeft: '24px' }}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </td>

                    {/* Description */}
                    <td style={{ padding: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter description"
                        value={row.description}
                        onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                        style={{ width: '100%', minWidth: '150px' }}
                      />
                    </td>

                    {/* Category */}
                    <td style={{ padding: '8px' }}>
                      <select
                        className="form-select"
                        value={row.category}
                        onChange={(e) => updateRow(row.id, 'category', e.target.value)}
                        style={{ width: '100%' }}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Meals */}
                    <td style={{ padding: '8px' }}>
                      <select
                        className="form-select"
                        value={row.meals}
                        onChange={(e) => updateRow(row.id, 'meals', e.target.value)}
                        style={{ width: '100%' }}
                      >
                        {MEALS.map((meal) => (
                          <option key={meal} value={meal}>
                            {meal}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Days */}
                    <td style={{ padding: '8px' }}>
                      <select
                        className="form-select"
                        value={row.days}
                        onChange={(e) => updateRow(row.id, 'days', e.target.value)}
                        style={{ width: '100%' }}
                      >
                        {DAYS.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Delete */}
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      {rows.length > 1 && (
                        <button
                          onClick={() => removeRow(row.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-subtle)',
                            padding: '4px',
                          }}
                          title="Delete row"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Row Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button className="button tertiary" onClick={addRow}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add row
            </button>
            <button className="button tertiary" onClick={() => addMultipleRows(5)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add 5 rows
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text)' }}>Create items with status:</span>
            <div style={{ position: 'relative' }}>
              <button
                className="button"
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                style={{
                  background: 'var(--success-surface)',
                  color: 'var(--success-text)',
                  border: '1px solid var(--success-border)',
                  fontWeight: '500',
                }}
              >
                {status}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {statusDropdownOpen && (
                <div className="sort-options" style={{ minWidth: '140px' }}>
                  {STATUSES.map((s) => (
                    <div
                      key={s}
                      className={`sort-option ${status === s ? 'active' : ''}`}
                      onClick={() => {
                        setStatus(s);
                        setStatusDropdownOpen(false);
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="button secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="button primary" onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMenuItemsModal;

