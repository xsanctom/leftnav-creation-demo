import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigation, getLabel } from '../context/NavigationContext';
import { useLanguage } from '../context/LanguageContext';

function MainItemCard({ item, sectionId, groupId = null, index, isChild = false, onEditItem, shouldAutoEdit = false }) {
  const { deleteItem, clearNewlyCreatedId } = useNavigation();
  const { language } = useLanguage();
  const [isEditingName, setIsEditingName] = useState(false);
  const itemNameDisplay = getLabel(item.label, language);
  const [itemName, setItemName] = useState(itemNameDisplay);
  const { updateItem } = useNavigation();

  // Auto-enter edit mode for newly created items
  useEffect(() => {
    if (shouldAutoEdit && !isEditingName) {
      setIsEditingName(true);
      clearNewlyCreatedId();
    }
  }, [shouldAutoEdit, isEditingName, clearNewlyCreatedId]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleNameChange = (e) => {
    setItemName(e.target.value);
  };

  const handleNameBlur = () => {
    if (itemName.trim()) {
      updateItem(item.id, { label: itemName.trim() }, language);
    } else {
      setItemName(itemNameDisplay);
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setItemName(itemNameDisplay);
      setIsEditingName(false);
    }
  };

  // Update itemName when language changes
  React.useEffect(() => {
    setItemName(getLabel(item.label, language));
  }, [language, item.label]);

  return (
    <div
      ref={setNodeRef}
      className="main-item-card"
      style={{
        ...style,
        border: '1px solid var(--border)',
        borderRadius: '4px',
        backgroundColor: isChild ? 'var(--surface-low)' : 'var(--surface)',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: 'grab',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text-placeholder)'
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="5" r="1"></circle>
          <circle cx="9" cy="12" r="1"></circle>
          <circle cx="9" cy="19" r="1"></circle>
          <circle cx="15" cy="5" r="1"></circle>
          <circle cx="15" cy="12" r="1"></circle>
          <circle cx="15" cy="19" r="1"></circle>
        </svg>
      </div>

      {isEditingName ? (
        <input
          type="text"
          value={itemName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          onKeyDown={handleNameKeyDown}
          autoFocus
          style={{
            fontSize: '14px',
            color: 'var(--text)',
            backgroundColor: 'var(--field)',
            border: '1px solid var(--border-active)',
            borderRadius: '4px',
            padding: '4px 8px',
            flex: 1,
            fontFamily: 'inherit'
          }}
        />
      ) : (
        <div
          style={{ fontSize: '14px', color: 'var(--text)', cursor: 'pointer', flex: 1 }}
          onClick={() => setIsEditingName(true)}
        >
          {itemNameDisplay}
        </div>
      )}

      <button
        onClick={() => onEditItem(item, isChild, groupId)}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          backgroundColor: 'var(--surface-hover)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          color: 'var(--text)',
          cursor: 'pointer'
        }}
      >
        Edit
      </button>

      <button
        onClick={() => {
          if (window.confirm(`Delete item "${itemNameDisplay}"?`)) {
            deleteItem(sectionId, item.id, isChild);
          }
        }}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          backgroundColor: 'var(--danger-surface)',
          border: '1px solid var(--danger-border)',
          borderRadius: '4px',
          color: 'var(--danger-text)',
          cursor: 'pointer'
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default MainItemCard;

