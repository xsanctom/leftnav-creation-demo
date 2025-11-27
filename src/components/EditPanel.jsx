import React, { useState, useEffect } from 'react';
import { useNavigation, getLabel } from '../context/NavigationContext';
import { useLanguage } from '../context/LanguageContext';
import IconPicker from './IconPicker';

function EditPanel({ type, item, sectionId, groupId, isChild, onClose }) {
  const { updateItem, updateSectionName } = useNavigation();
  const { language } = useLanguage();
  const currentLabel = type === 'section' 
    ? getLabel(item.name, language) 
    : getLabel(item.label, language);
  const [label, setLabel] = useState(currentLabel);
  const [icon, setIcon] = useState(item.icon || '');
  const [link, setLink] = useState(item.link || '#');
  const [badge, setBadge] = useState(item.badge || '');

  useEffect(() => {
    const newLabel = type === 'section' 
      ? getLabel(item.name, language) 
      : getLabel(item.label, language);
    setLabel(newLabel);
    setIcon(item.icon || '');
    setLink(item.link || '#');
    setBadge(item.badge || '');
  }, [item, language, type]);

  const handleSave = () => {
    if (type === 'section') {
      updateSectionName(item.id, label.trim(), language);
    } else {
      const updates = {
        label: label.trim(),
        icon: icon.trim(),
        link: link.trim() || '#',
      };
      if (type === 'group') {
        updates.badge = badge.trim();
      }
      updateItem(item.id, updates, language);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '104px', // 40px TopHeader + 64px PageHeader
        right: 0,
        bottom: 0,
        width: '400px',
        backgroundColor: 'var(--surface-raised)',
        borderLeft: '1px solid var(--border)',
        boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.1)',
        zIndex: 99, // Lower than PageHeader (100) to ensure it doesn't cover it
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{
        padding: '20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text)', margin: 0 }}>
          Edit {type === 'section' ? 'Section' : type === 'group' ? 'Group' : 'Item'}
        </h3>
        <button
          onClick={onClose}
          style={{
            padding: '4px 8px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-subtle)',
            fontSize: '20px'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px' }}>
            Name ({language === 'en' ? 'English' : '日本語'})
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
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

        {type !== 'section' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px' }}>
                Icon
              </label>
              <IconPicker
                selectedIcon={icon}
                onSelectIcon={(selectedIconFile) => setIcon(selectedIconFile || '')}
              />
            </div>

            {type !== 'group' && (
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px' }}>
                  Link
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="#"
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
            )}

            {type === 'group' && (
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px' }}>
                  Badge (optional)
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g., TC"
                  maxLength={10}
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
            )}
          </>
        )}
      </div>

      <div style={{
        padding: '20px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={onClose}
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
        <button
          onClick={handleSave}
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
          Save
        </button>
      </div>
    </div>
  );
}

export default EditPanel;

