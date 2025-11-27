import React, { useState, useEffect } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useNavigation, getLabel } from '../context/NavigationContext';
import { useLanguage } from '../context/LanguageContext';
import GroupCard from './GroupCard';
import MainItemCard from './MainItemCard';

function SectionCard({ section, sectionIndex, onEditSection, onEditItem, shouldAutoEdit = false }) {
  const { deleteSection, addGroup, addMainItem, clearNewlyCreatedId, newlyCreatedId } = useNavigation();
  const { language } = useLanguage();
  const [isEditingName, setIsEditingName] = useState(false);
  const sectionNameDisplay = getLabel(section.name, language);
  const [sectionName, setSectionName] = useState(sectionNameDisplay);
  const { updateSectionName } = useNavigation();

  // Auto-enter edit mode for newly created sections
  useEffect(() => {
    if (shouldAutoEdit && !isEditingName) {
      setIsEditingName(true);
      clearNewlyCreatedId();
    }
  }, [shouldAutoEdit, isEditingName, clearNewlyCreatedId]);

  const handleNameChange = (e) => {
    setSectionName(e.target.value);
  };

  const handleNameBlur = () => {
    if (sectionName.trim()) {
      updateSectionName(section.id, sectionName.trim(), language);
    } else {
      setSectionName(sectionNameDisplay);
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setSectionName(sectionNameDisplay);
      setIsEditingName(false);
    }
  };

  // Update sectionName when language changes
  React.useEffect(() => {
    setSectionName(getLabel(section.name, language));
  }, [language, section.name]);

  return (
    <div className="section-card" style={{
      border: '1px solid var(--border)',
      borderRadius: '8px',
      backgroundColor: 'var(--surface)',
      padding: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          {isEditingName ? (
            <input
              type="text"
              value={sectionName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              autoFocus
              style={{
                fontSize: '16px',
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
            <h3
              style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text)', cursor: 'pointer' }}
              onClick={() => setIsEditingName(true)}
            >
              {sectionNameDisplay}
            </h3>
          )}
          <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
            {section.items.length} {section.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => addGroup(section.id, 'New Group', language)}
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
            + Group
          </button>
          <button
            onClick={() => addMainItem(section.id, null, 'New Item', language)}
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
            onClick={() => onEditSection(section)}
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
              if (window.confirm(`Delete section "${sectionNameDisplay}"?`)) {
                deleteSection(section.id);
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
      </div>

      <SortableContext
        items={section.items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {section.items.length === 0 ? (
            <div style={{ 
              padding: '16px', 
              textAlign: 'center', 
              color: 'var(--text-subtle)',
              fontSize: '14px',
              border: '1px dashed var(--border)',
              borderRadius: '4px'
            }}>
              No items yet. Add a group or item to get started.
            </div>
          ) : (
            section.items.map((item, index) => {
              if (item.type === 'group') {
                return (
                  <GroupCard
                    key={item.id}
                    group={item}
                    sectionId={section.id}
                    index={index}
                    onEditItem={onEditItem}
                    shouldAutoEdit={item.id === newlyCreatedId}
                  />
                );
              } else {
                return (
                  <MainItemCard
                    key={item.id}
                    item={item}
                    sectionId={section.id}
                    index={index}
                    onEditItem={onEditItem}
                    shouldAutoEdit={item.id === newlyCreatedId}
                  />
                );
              }
            })
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default SectionCard;

