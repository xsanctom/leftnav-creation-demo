import React, { createContext, useContext, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { translations } from '../data/translations';

const NavigationContext = createContext();

// Helper function to generate unique IDs
const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper function to get label for a specific language
// Handles both multilingual objects { en: "...", ja: "..." } and legacy string labels
export const getLabel = (labelObj, language = 'en') => {
  if (!labelObj) return '';
  if (typeof labelObj === 'string') {
    // Legacy format - try to get translation
    return translations[language]?.[labelObj] || labelObj;
  }
  if (typeof labelObj === 'object' && labelObj.en !== undefined) {
    // Multilingual format
    return labelObj[language] || labelObj.en || '';
  }
  return '';
};

// Helper function to create multilingual label object
export const createMultilingualLabel = (enText, jaText = '') => {
  return {
    en: enText || '',
    ja: jaText || ''
  };
};

// Helper function to convert string label to multilingual format
const convertToMultilingual = (text) => {
  if (!text) return createMultilingualLabel('');
  const enText = text;
  const jaText = translations.ja[text] || translations.ja[text.toUpperCase()] || '';
  return createMultilingualLabel(enText, jaText);
};

// Initial data structure extracted from current Sidebar
// Always returns the same defaults - no persistence
const getInitialData = () => {
  return {
    home: {
      id: 'home',
      label: createMultilingualLabel('Home', 'ホーム'),
      icon: 'home.svg',
      fixed: true
    },
    sections: [
      {
        id: 'section-current-venue',
        name: createMultilingualLabel('Current Venue', '現在の店舗'),
        items: [
          {
            id: 'item-menu',
            type: 'main',
            label: createMultilingualLabel('Menu', 'メニュー'),
            icon: 'book.svg',
            link: '#'
          },
          {
            id: 'item-hours',
            type: 'main',
            label: createMultilingualLabel('Hours & Meal Periods', '営業シフト'),
            icon: 'calendar.svg',
            link: '#'
          },
          {
            id: 'item-tables',
            type: 'main',
            label: createMultilingualLabel('Tables', 'テーブル'),
            icon: 'floorplan.svg',
            link: '#'
          },
          {
            id: 'item-venue-settings',
            type: 'main',
            label: createMultilingualLabel('Venue Settings', '店舗'),
            icon: 'building.svg',
            link: '#'
          }
        ]
      },
      {
        id: 'section-global',
        name: createMultilingualLabel('Global', 'グローバル'),
        items: [
          {
            id: 'item-booking-theme',
            type: 'main',
            label: createMultilingualLabel('Booking Theme', '予約ページ用テーマ'),
            icon: 'paint-brush.svg',
            link: '#'
          },
          {
            id: 'item-users',
            type: 'main',
            label: createMultilingualLabel('Users', '利用者'),
            icon: 'user.svg',
            link: '#'
          },
          {
            id: 'group-engagement',
            type: 'group',
            label: createMultilingualLabel('Engagement', 'エンゲージメント'),
            icon: 'user--favorite--alt.svg',
            expanded: false,
            children: [
              {
                id: 'item-marketing-campaign',
                type: 'main',
                label: createMultilingualLabel('Marketing Campaign', 'EDMマーケティング'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-survey',
                type: 'main',
                label: createMultilingualLabel('Survey', 'カスタマーサーベイ'),
                icon: '',
                link: '#'
              }
            ]
          },
          {
            id: 'group-messaging',
            type: 'group',
            label: createMultilingualLabel('Messaging', 'メッセージング'),
            icon: 'email.svg',
            expanded: false,
            children: [
              {
                id: 'item-email-templates',
                type: 'main',
                label: createMultilingualLabel('Email Templates', 'メールテンプレート'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-email-messages',
                type: 'main',
                label: createMultilingualLabel('Email Messages', 'Eメールメッセージ'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-sms-messages',
                type: 'main',
                label: createMultilingualLabel('SMS Messages', 'SMSメッセージ'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-messenger-apps',
                type: 'main',
                label: createMultilingualLabel('Messenger Apps', 'メッセンジャーアプリ'),
                icon: '',
                link: '#'
              }
            ]
          },
          {
            id: 'group-phone',
            type: 'group',
            label: createMultilingualLabel('Phone', '電話連動'),
            icon: 'phone.svg',
            expanded: false,
            children: [
              {
                id: 'item-cti',
                type: 'main',
                label: createMultilingualLabel('CTI', 'CTI (電話連動)'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-phone-calls',
                type: 'main',
                label: createMultilingualLabel('Phone Calls', '通話'),
                icon: '',
                link: '#'
              }
            ]
          },
          {
            id: 'group-advanced',
            type: 'group',
            label: createMultilingualLabel('Advanced', '高度な設定'),
            icon: 'flow--connection.svg',
            expanded: false,
            children: [
              {
                id: 'item-chains',
                type: 'main',
                label: createMultilingualLabel('Chains', 'チェーン'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-franchise',
                type: 'main',
                label: createMultilingualLabel('Franchise', '系列店'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-roles',
                type: 'main',
                label: createMultilingualLabel('Roles', '権限設定'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-security-center',
                type: 'main',
                label: createMultilingualLabel('Security Center', 'セキュリティセンター'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-booking-widget',
                type: 'main',
                label: createMultilingualLabel('Booking Widget', '予約ウィジェット'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-service-categories',
                type: 'main',
                label: createMultilingualLabel('Service Categories', '席のカテゴリ'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-promo-codes',
                type: 'main',
                label: createMultilingualLabel('Promo Codes', 'プロモーションコード'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-menu-templates',
                type: 'main',
                label: createMultilingualLabel('Menu Templates', 'Menu Templates'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-pace-rules',
                type: 'main',
                label: createMultilingualLabel('Pace Rules', 'Pace Rules'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-holidays',
                type: 'main',
                label: createMultilingualLabel('Holidays', 'Holidays'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-reservation-stasues',
                type: 'main',
                label: createMultilingualLabel('Reservation Stasues', 'Reservation Stasues'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-reservation-flags',
                type: 'main',
                label: createMultilingualLabel('Reservation Flags', 'Reservation Flags'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-custom-labels',
                type: 'main',
                label: createMultilingualLabel('Custom Labels', 'Custom Labels'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-alert-rules',
                type: 'main',
                label: createMultilingualLabel('Alert Rules', 'Alert Rules'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-audit-trail',
                type: 'main',
                label: createMultilingualLabel('Audit Trail', 'Audit Trail'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-email-templates-advanced',
                type: 'main',
                label: createMultilingualLabel('Email Templates', 'メールテンプレート'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-email-messages-advanced',
                type: 'main',
                label: createMultilingualLabel('Email Messages', 'Eメールメッセージ'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-sms-messages-advanced',
                type: 'main',
                label: createMultilingualLabel('SMS Messages', 'SMSメッセージ'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-messenger-apps-advanced',
                type: 'main',
                label: createMultilingualLabel('Messenger Apps', 'メッセンジャーアプリ'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-vouchers',
                type: 'main',
                label: createMultilingualLabel('Vouchers', 'Vouchers'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-payment-gateways',
                type: 'main',
                label: createMultilingualLabel('Payment Gateways', 'Payment Gateways'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-payment-gateways-v2',
                type: 'main',
                label: createMultilingualLabel('Payment Gateways (V2)', 'Payment Gateways (V2)'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-payment-history',
                type: 'main',
                label: createMultilingualLabel('Payment History', 'Payment History'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-payment-history-v2',
                type: 'main',
                label: createMultilingualLabel('Payment History (V2)', 'Payment History (V2)'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-booking-sites',
                type: 'main',
                label: createMultilingualLabel('Booking Sites', 'Booking Sites'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-business-integrations',
                type: 'main',
                label: createMultilingualLabel('Business Integrations', 'Business Integrations'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-web-trackers',
                type: 'main',
                label: createMultilingualLabel('Web Trackers', 'Web Trackers'),
                icon: '',
                link: '#'
              }
            ]
          },
          {
            id: 'group-admin',
            type: 'group',
            label: createMultilingualLabel('Admin', 'Admin'),
            icon: 'store.svg',
            expanded: false,
            badge: 'TC',
            children: [
              {
                id: 'item-portal-venues-list',
                type: 'main',
                label: createMultilingualLabel('Portal Venues List', 'Portal Venues List'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-franchise-groups',
                type: 'main',
                label: createMultilingualLabel('Franchise Groups', 'Franchise Groups'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-tablecheck-users',
                type: 'main',
                label: createMultilingualLabel('TableCheck Users', 'TableCheck Users'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-user-query',
                type: 'main',
                label: createMultilingualLabel('User Query', 'User Query'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-repeat-blocks',
                type: 'main',
                label: createMultilingualLabel('Repeat Blocks', 'Repeat Blocks'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-app-notice',
                type: 'main',
                label: createMultilingualLabel('App Notice', 'App Notice'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-sms-templates',
                type: 'main',
                label: createMultilingualLabel('SMS Templates', 'SMS Templates'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-sms-prices',
                type: 'main',
                label: createMultilingualLabel('SMS Prices', 'SMS Prices'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-payment-diagnostics',
                type: 'main',
                label: createMultilingualLabel('Payment Diagnostics', 'Payment Diagnostics'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-data-import',
                type: 'main',
                label: createMultilingualLabel('Data Import', 'Data Import'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-crm-integration',
                type: 'main',
                label: createMultilingualLabel('CRM Integration', 'CRM Integration'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-membership-programs',
                type: 'main',
                label: createMultilingualLabel('Membership Programs', 'Membership Programs'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-pos-integration',
                type: 'main',
                label: createMultilingualLabel('POS Integration', 'POS Integration'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-chit-printers',
                type: 'main',
                label: createMultilingualLabel('Chit Printers', 'Chit Printers'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-export-rules',
                type: 'main',
                label: createMultilingualLabel('Export Rules', 'Export Rules'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-saml-providers',
                type: 'main',
                label: createMultilingualLabel('SAML Providers', 'SAML Providers'),
                icon: '',
                link: '#'
              },
              {
                id: 'item-tablecheck-api',
                type: 'main',
                label: createMultilingualLabel('TableCheck API', 'TableCheck API'),
                icon: '',
                link: '#'
              }
            ]
          }
        ]
      }
    ]
  };
};

// Empty data structure for clearing all navigation data
// Returns only the home item and an empty sections array
const getEmptyData = () => {
  return {
    home: {
      id: 'home',
      label: createMultilingualLabel('Home', 'ホーム'),
      icon: 'home.svg',
      fixed: true
    },
    sections: []
  };
};

export const NavigationProvider = ({ children }) => {
  const [navigationData, setNavigationData] = useState(getInitialData);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [newlyCreatedId, setNewlyCreatedId] = useState(null);
  
  // Get current language from LanguageContext
  // We'll use a ref or context to get this, but for now we'll pass it through props
  // Actually, we'll need to import useLanguage here, but that creates a circular dependency
  // So we'll make the language a parameter to the update functions instead
  // Components will pass the current language when calling these functions

  // No persistence - changes are temporary and reset on refresh

  // Find item by ID (searches all sections, groups, and items)
  const findItemById = (id) => {
    for (const section of navigationData.sections) {
      for (const item of section.items) {
        if (item.id === id) return { item, section };
        if (item.type === 'group' && item.children) {
          const child = item.children.find(c => c.id === id);
          if (child) return { item: child, section, group: item };
        }
      }
    }
    return null;
  };

  // Add section
  const addSection = (name = 'New Section', language = 'en') => {
    if (navigationData.sections.length >= 6) {
      alert('Maximum of 6 sections allowed');
      return;
    }
    const newSection = {
      id: generateId(),
      name: createMultilingualLabel(name, ''),
      items: []
    };
    setNavigationData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setNewlyCreatedId(newSection.id);
    return newSection;
  };

  // Update section name for specific language
  const updateSectionName = (sectionId, newName, language = 'en') => {
    setNavigationData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id !== sectionId) return section;
        const currentName = typeof section.name === 'object' ? section.name : createMultilingualLabel(section.name || '', '');
        return {
          ...section,
          name: {
            ...currentName,
            [language]: newName
          }
        };
      })
    }));
  };

  // Delete section
  const deleteSection = (sectionId) => {
    if (navigationData.sections.length <= 2) {
      alert('Minimum of 2 sections required');
      return;
    }
    setNavigationData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  // Add group to section
  const addGroup = (sectionId, label = 'New Group', language = 'en') => {
    const newGroup = {
      id: generateId(),
      type: 'group',
      label: createMultilingualLabel(label, ''),
      icon: '',
      expanded: false,
      children: []
    };
    setNavigationData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, items: [...section.items, newGroup] }
          : section
      )
    }));
    setNewlyCreatedId(newGroup.id);
    return newGroup;
  };

  // Add main item
  const addMainItem = (sectionId, groupId = null, label = 'New Item', language = 'en') => {
    const newItem = {
      id: generateId(),
      type: 'main',
      label: createMultilingualLabel(label, ''),
      icon: '',
      link: '#'
    };

    if (groupId) {
      // Add to group
      setNavigationData(prev => ({
        ...prev,
        sections: prev.sections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.map(item =>
                  item.id === groupId
                    ? { ...item, children: [...(item.children || []), newItem] }
                    : item
                )
              }
            : section
        )
      }));
      // Automatically expand the group to show the newly added item
      setExpandedGroups(prev => ({
        ...prev,
        [groupId]: true
      }));
    } else {
      // Add to section
      setNavigationData(prev => ({
        ...prev,
        sections: prev.sections.map(section =>
          section.id === sectionId
            ? { ...section, items: [...section.items, newItem] }
            : section
        )
      }));
    }
    setNewlyCreatedId(newItem.id);
    return newItem;
  };

  // Update item (works for groups and main items)
  // If updates contains 'label', it should be a string for the current language
  // The function will update the label for that language only
  const updateItem = (itemId, updates, language = 'en') => {
    setNavigationData(prev => ({
      ...prev,
      sections: prev.sections.map(section => ({
        ...section,
        items: section.items.map(item => {
          if (item.id === itemId) {
            const updatedItem = { ...item };
            // Handle label update for specific language
            if (updates.label !== undefined) {
              const currentLabel = typeof item.label === 'object' 
                ? item.label 
                : createMultilingualLabel(item.label || '', '');
              updatedItem.label = {
                ...currentLabel,
                [language]: updates.label
              };
              // Remove label from updates since we handled it
              const { label, ...restUpdates } = updates;
              return { ...updatedItem, ...restUpdates };
            }
            return { ...item, ...updates };
          }
          if (item.type === 'group' && item.children) {
            return {
              ...item,
              children: item.children.map(child => {
                if (child.id === itemId) {
                  const updatedChild = { ...child };
                  // Handle label update for specific language
                  if (updates.label !== undefined) {
                    const currentLabel = typeof child.label === 'object' 
                      ? child.label 
                      : createMultilingualLabel(child.label || '', '');
                    updatedChild.label = {
                      ...currentLabel,
                      [language]: updates.label
                    };
                    // Remove label from updates since we handled it
                    const { label, ...restUpdates } = updates;
                    return { ...updatedChild, ...restUpdates };
                  }
                  return { ...child, ...updates };
                }
                return child;
              })
            };
          }
          return item;
        })
      }))
    }));
  };

  // Delete item
  const deleteItem = (sectionId, itemId, isChild = false) => {
    setNavigationData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id !== sectionId) return section;
        
        if (isChild) {
          return {
            ...section,
            items: section.items.map(item => {
              if (item.type === 'group' && item.children) {
                return {
                  ...item,
                  children: item.children.filter(child => child.id !== itemId)
                };
              }
              return item;
            })
          };
        } else {
          return {
            ...section,
            items: section.items.filter(item => item.id !== itemId)
          };
        }
      })
    }));
  };

  // Move item (for drag and drop)
  const moveItem = (draggedId, targetSectionId, targetIndex, targetGroupId = null) => {
    const result = findItemById(draggedId);
    if (!result) return;

    const { item: draggedItem, section: sourceSection, group: sourceGroup } = result;

    // Remove from source
    setNavigationData(prev => {
      const newData = { ...prev };
      
      if (sourceGroup) {
        // Remove from group children
        newData.sections = newData.sections.map(section =>
          section.id === sourceSection.id
            ? {
                ...section,
                items: section.items.map(group =>
                  group.id === sourceGroup.id
                    ? {
                        ...group,
                        children: group.children.filter(child => child.id !== draggedId)
                      }
                    : group
                )
              }
            : section
        );
      } else {
        // Remove from section items
        newData.sections = newData.sections.map(section =>
          section.id === sourceSection.id
            ? {
                ...section,
                items: section.items.filter(item => item.id !== draggedId)
              }
            : section
        );
      }

      // Add to target
      if (targetGroupId) {
        // Add to group children
        newData.sections = newData.sections.map(section =>
          section.id === targetSectionId
            ? {
                ...section,
                items: section.items.map(item =>
                  item.id === targetGroupId
                    ? {
                        ...item,
                        children: [...(item.children || []), draggedItem]
                      }
                    : item
                )
              }
            : section
        );
      } else {
        // Add to section items at target index
        newData.sections = newData.sections.map(section => {
          if (section.id !== targetSectionId) return section;
          const newItems = [...section.items];
          newItems.splice(targetIndex, 0, draggedItem);
          return { ...section, items: newItems };
        });
      }

      return newData;
    });
  };

  // Reorder items within section
  const reorderItems = (sectionId, startIndex, endIndex) => {
    setNavigationData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id !== sectionId) return section;
        // Use arrayMove for proper reordering
        const newItems = arrayMove(section.items, startIndex, endIndex);
        return { ...section, items: newItems };
      })
    }));
  };

  // Reorder children within a group
  const reorderGroupChildren = (sectionId, groupId, startIndex, endIndex) => {
    setNavigationData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          items: section.items.map(item => {
            if (item.id === groupId && item.children) {
              // Ensure indices are valid
              if (startIndex < 0 || startIndex >= item.children.length) return item;
              if (endIndex < 0 || endIndex >= item.children.length) return item;
              // Use arrayMove to reorder - creates new array reference
              const newChildren = arrayMove(item.children, startIndex, endIndex);
              return { ...item, children: newChildren };
            }
            return item;
          })
        };
      })
    }));
  };

  // Toggle group expansion (accordion-style: only one group expanded at a time)
  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => {
      const isCurrentlyExpanded = prev[groupId];
      
      if (isCurrentlyExpanded) {
        // If currently expanded, collapse it
        return {
          ...prev,
          [groupId]: false
        };
      } else {
        // If currently collapsed, expand it and collapse all others
        return {
          [groupId]: true
        };
      }
    });
  };

  // Clear all navigation data and reset to empty state
  const clearAll = () => {
    setNavigationData(getEmptyData());
    setExpandedGroups({});
    setNewlyCreatedId(null);
  };

  // Clear the newly created ID (called after edit mode is entered)
  const clearNewlyCreatedId = () => {
    setNewlyCreatedId(null);
  };

  const value = {
    navigationData,
    setNavigationData,
    expandedGroups,
    setExpandedGroups,
    newlyCreatedId,
    clearNewlyCreatedId,
    addSection,
    updateSectionName,
    deleteSection,
    addGroup,
    addMainItem,
    updateItem,
    deleteItem,
    moveItem,
    reorderItems,
    reorderGroupChildren,
    toggleGroup,
    findItemById,
    clearAll,
    getLabel // Export helper function
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

