import React, { useState } from 'react';
import { AVAILABLE_ICONS, getIconUrl } from '../utils/iconUtils';

function IconPicker({ selectedIcon, onSelectIcon }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = AVAILABLE_ICONS.filter(icon =>
    icon.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    icon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: '4px',
      backgroundColor: 'var(--surface)',
      padding: '12px'
    }}>
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Search icons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '14px',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            backgroundColor: 'var(--field)',
            color: 'var(--text)',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '8px',
        maxHeight: '300px',
        overflowY: 'auto',
        padding: '4px'
      }}>
        {/* None option */}
        <button
          onClick={() => onSelectIcon(null)}
          style={{
            aspectRatio: '1',
            border: '2px solid',
            borderColor: selectedIcon === null ? 'var(--brand-primary)' : 'var(--border)',
            borderRadius: '4px',
            backgroundColor: selectedIcon === null ? 'var(--brand-primary)' : 'var(--surface-hover)',
            color: selectedIcon === null ? 'var(--brand-primary-text)' : 'var(--text-subtle)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          title="No icon"
        >
          <div style={{ fontSize: '18px', marginBottom: '4px' }}>×</div>
          <div>None</div>
        </button>

        {/* Icon options */}
        {filteredIcons.map((icon) => {
          const isSelected = selectedIcon === icon.file || selectedIcon === icon.name;
          return (
            <button
              key={icon.name}
              onClick={() => onSelectIcon(icon.file)}
              style={{
                aspectRatio: '1',
                border: '2px solid',
                borderColor: isSelected ? 'var(--brand-primary)' : 'var(--border)',
                borderRadius: '4px',
                backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--surface)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              title={icon.label}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  e.currentTarget.style.borderColor = 'var(--border-active)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--surface)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }
              }}
            >
              <img
                src={getIconUrl(icon.file)}
                alt={icon.label}
                style={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain',
                  filter: isSelected ? 'brightness(0) invert(1)' : 'none',
                  opacity: isSelected ? 1 : 0.8
                }}
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<div style="font-size: 10px; color: var(--text-subtle)">${icon.name}</div>`;
                }}
              />
            </button>
          );
        })}
      </div>

      {filteredIcons.length === 0 && (
        <div style={{
          padding: '24px',
          textAlign: 'center',
          color: 'var(--text-subtle)',
          fontSize: '14px'
        }}>
          No icons found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}

export default IconPicker;

