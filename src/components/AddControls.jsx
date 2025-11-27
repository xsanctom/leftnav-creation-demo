import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useLanguage } from '../context/LanguageContext';

function AddControls() {
  const { addSection, navigationData } = useNavigation();
  const { language } = useLanguage();
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      addSection(newSectionName.trim(), language);
      setNewSectionName('');
      setShowAddSection(false);
    }
  };

  if (navigationData.sections.length >= 3) {
    return null; // Don't show add button if max sections reached
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      alignItems: 'flex-end'
    }}>
      {showAddSection ? (
        <div style={{
          backgroundColor: 'var(--surface-raised)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddSection();
              } else if (e.key === 'Escape') {
                setShowAddSection(false);
                setNewSectionName('');
              }
            }}
            placeholder="Section name"
            autoFocus
            style={{
              padding: '8px 12px',
              fontSize: '14px',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              backgroundColor: 'var(--field)',
              color: 'var(--text)',
              fontFamily: 'inherit',
              minWidth: '200px'
            }}
          />
          <button
            onClick={handleAddSection}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: 'var(--brand-primary)',
              color: 'var(--brand-primary-text)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowAddSection(false);
              setNewSectionName('');
            }}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAddSection(true)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-primary)',
            color: 'var(--brand-primary-text)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            fontSize: '24px',
            fontWeight: '300'
          }}
          title="Add Section"
        >
          +
        </button>
      )}
    </div>
  );
}

export default AddControls;

