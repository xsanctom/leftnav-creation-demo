import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useNavigation, getLabel } from '../context/NavigationContext';
import { useLanguage } from '../context/LanguageContext';
import MainItemCard from './MainItemCard';

function GroupCard({ group, sectionId, index, onEditItem, shouldAutoEdit = false }) {
  const { deleteItem, addMainItem, expandedGroups, toggleGroup, clearNewlyCreatedId, newlyCreatedId } = useNavigation();
  const { language } = useLanguage();
  const [isEditingName, setIsEditingName] = useState(false);
  const groupNameDisplay = getLabel(group.label, language);
  const [groupName, setGroupName] = useState(groupNameDisplay);
  const { updateItem } = useNavigation();
  const isExpanded = expandedGroups[group.id] || false;

  // Auto-enter edit mode for newly created groups
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
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleNameBlur = () => {
    if (groupName.trim()) {
      updateItem(group.id, { label: groupName.trim() }, language);
    } else {
      setGroupName(groupNameDisplay);
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setGroupName(groupNameDisplay);
      setIsEditingName(false);
    }
  };

  // Update groupName when language changes
  React.useEffect(() => {
    setGroupName(getLabel(group.label, language));
  }, [language, group.label]);

  return (
    <div
      ref={setNodeRef}
      className="group-card"
      style={{
        ...style,
        border: '1px solid var(--border)',
        borderRadius: '4px',
        backgroundColor: 'var(--surface-raised)',
        padding: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: isExpanded ? '8px' : '0' }}>
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
        
        <button
          onClick={() => toggleGroup(group.id)}
          style={{
            padding: '4px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-subtle)'
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {isEditingName ? (
          <input
            type="text"
            value={groupName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
            autoFocus
            style={{
              fontSize: '14px',
              fontWeight: '500',
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
            style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', cursor: 'pointer', flex: 1 }}
            onClick={() => setIsEditingName(true)}
          >
            {groupNameDisplay}
            {group.badge && (
              <span style={{
                marginLeft: '8px',
                padding: '2px 6px',
                fontSize: '10px',
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--brand-primary-text)',
                borderRadius: '3px'
              }}>
                {group.badge}
              </span>
            )}
          </div>
        )}

        <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
          {group.children?.length || 0} {group.children?.length === 1 ? 'item' : 'items'}
        </span>

        <button
          onClick={() => addMainItem(sectionId, group.id, 'New Item', language)}
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
          + Item
        </button>

        <button
          onClick={() => onEditItem(group, false, null)}
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
            if (window.confirm(`Delete group "${groupNameDisplay}" and all its items?`)) {
              deleteItem(sectionId, group.id, false);
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

      {isExpanded && group.children && group.children.length > 0 && (
        <SortableContext
          items={group.children.map(child => child.id)}
          strategy={verticalListSortingStrategy}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '24px', marginTop: '8px' }}>
            {group.children.map((child, childIndex) => (
              <MainItemCard
                key={child.id}
                item={child}
                sectionId={sectionId}
                groupId={group.id}
                index={childIndex}
                isChild={true}
                onEditItem={onEditItem}
                shouldAutoEdit={child.id === newlyCreatedId}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}

export default GroupCard;

