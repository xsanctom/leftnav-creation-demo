import React, { createContext, useContext, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

const NavigationContext = createContext();

// Helper function to generate unique IDs
const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Initial data structure extracted from current Sidebar
// Always returns the same defaults - no persistence
const getInitialData = () => {
  return {
    home: {
      id: 'home',
      label: 'Home',
      icon: 'home.svg',
      fixed: true
    },
    sections: [
      {
        id: 'section-current-venue',
        name: 'Current Venue',
        items: [
          {
            id: 'item-menu',
            type: 'main',
            label: 'Menu',
            icon: 'book.svg',
            link: '#'
          },
          {
            id: 'item-hours',
            type: 'main',
            label: 'Hours & Meal Periods',
            icon: 'calendar.svg',
            link: '#'
          },
          {
            id: 'item-tables',
            type: 'main',
            label: 'Tables',
            icon: 'floorplan.svg',
            link: '#'
          },
          {
            id: 'item-venue-settings',
            type: 'main',
            label: 'Venue Settings',
            icon: 'building.svg',
            link: '#'
          }
        ]
      },
      {
        id: 'section-global',
        name: 'Global',
        items: [
          {
            id: 'item-booking-theme',
            type: 'main',
            label: 'Booking Theme',
            icon: 'paint-brush.svg',
            link: '#'
          },
          {
            id: 'item-users',
            type: 'main',
            label: 'Users',
            icon: 'user.svg',
            link: '#'
          },
          {
            id: 'group-engagement',
            type: 'group',
            label: 'Engagement',
            icon: 'email.svg',
            expanded: false,
            children: [
              {
                id: 'item-marketing-campaign',
                type: 'main',
                label: 'Marketing Campaign',
                icon: '',
                link: '#'
              },
              {
                id: 'item-survey',
                type: 'main',
                label: 'Survey',
                icon: '',
                link: '#'
              }
            ]
          },
          {
            id: 'group-messaging',
            type: 'group',
            label: 'Messaging',
            icon: 'email.svg',
            expanded: false,
            children: [
              {
                id: 'item-email-templates',
                type: 'main',
                label: 'Email Templates',
                icon: '',
                link: '#'
              },
              {
                id: 'item-email-messages',
                type: 'main',
                label: 'Email Messages',
                icon: '',
                link: '#'
              },
              {
                id: 'item-sms-messages',
                type: 'main',
                label: 'SMS Messages',
                icon: '',
                link: '#'
              },
              {
                id: 'item-messenger-apps',
                type: 'main',
                label: 'Messenger Apps',
                icon: '',
                link: '#'
              }
            ]
          },
          {
            id: 'group-phone',
            type: 'group',
            label: 'Phone',
            icon: 'phone.svg',
            expanded: false,
            children: [
              {
                id: 'item-cti',
                type: 'main',
                label: 'CTI',
                icon: '',
                link: '#'
              },
              {
                id: 'item-phone-calls',
                type: 'main',
                label: 'Phone Calls',
                icon: '',
                link: '#'
              }
            ]
          },
          {
            id: 'group-advanced',
            type: 'group',
            label: 'Advanced',
            icon: 'flow--connection.svg',
            expanded: false,
            children: [
              {
                id: 'item-chains',
                type: 'main',
                label: 'Chains',
                icon: '',
                link: '#'
              },
              {
                id: 'item-franchise',
                type: 'main',
                label: 'Franchise',
                icon: '',
                link: '#'
              },
              {
                id: 'item-roles',
                type: 'main',
                label: 'Roles',
                icon: '',
                link: '#'
              },
              {
                id: 'item-security-center',
                type: 'main',
                label: 'Security Center',
                icon: '',
                link: '#'
              },
              {
                id: 'item-booking-widget',
                type: 'main',
                label: 'Booking Widget',
                icon: '',
                link: '#'
              },
              {
                id: 'item-service-categories',
                type: 'main',
                label: 'Service Categories',
                icon: '',
                link: '#'
              },
              {
                id: 'item-promo-codes',
                type: 'main',
                label: 'Promo Codes',
                icon: '',
                link: '#'
              },
              {
                id: 'item-menu-templates',
                type: 'main',
                label: 'Menu Templates',
                icon: '',
                link: '#'
              },
              {
                id: 'item-pace-rules',
                type: 'main',
                label: 'Pace Rules',
                icon: '',
                link: '#'
              },
              {
                id: 'item-holidays',
                type: 'main',
                label: 'Holidays',
                icon: '',
                link: '#'
              },
              {
                id: 'item-reservation-stasues',
                type: 'main',
                label: 'Reservation Stasues',
                icon: '',
                link: '#'
              },
              {
                id: 'item-reservation-flags',
                type: 'main',
                label: 'Reservation Flags',
                icon: '',
                link: '#'
              },
              {
                id: 'item-custom-labels',
                type: 'main',
                label: 'Custom Labels',
                icon: '',
                link: '#'
              },
              {
                id: 'item-alert-rules',
                type: 'main',
                label: 'Alert Rules',
                icon: '',
                link: '#'
              },
              {
                id: 'item-audit-trail',
                type: 'main',
                label: 'Audit Trail',
                icon: '',
                link: '#'
              },
              {
                id: 'item-email-templates-advanced',
                type: 'main',
                label: 'Email Templates',
                icon: '',
                link: '#'
              },
              {
                id: 'item-email-messages-advanced',
                type: 'main',
                label: 'Email Messages',
                icon: '',
                link: '#'
              },
              {
                id: 'item-sms-messages-advanced',
                type: 'main',
                label: 'SMS Messages',
                icon: '',
                link: '#'
              },
              {
                id: 'item-messenger-apps-advanced',
                type: 'main',
                label: 'Messenger Apps',
                icon: '',
                link: '#'
              },
              {
                id: 'item-vouchers',
                type: 'main',
                label: 'Vouchers',
                icon: '',
                link: '#'
              },
              {
                id: 'item-payment-gateways',
                type: 'main',
                label: 'Payment Gateways',
                icon: '',
                link: '#'
              },
              {
                id: 'item-payment-gateways-v2',
                type: 'main',
                label: 'Payment Gateways (V2)',
                icon: '',
                link: '#'
              },
              {
                id: 'item-payment-history',
                type: 'main',
                label: 'Payment History',
                icon: '',
                link: '#'
              },
              {
                id: 'item-payment-history-v2',
                type: 'main',
                label: 'Payment History (V2)',
                icon: '',
                link: '#'
              },
              {
                id: 'item-booking-sites',
                type: 'main',
                label: 'Booking Sites',
                icon: '',
                link: '#'
              },
              {
                id: 'item-business-integrations',
                type: 'main',
                label: 'Business Integrations',
                icon: '',
                link: '#'
              },
              {
                id: 'item-web-trackers',
                type: 'main',
                label: 'Web Trackers',
                icon: '',
                link: '#'
              }
            ]
          },
          {
            id: 'group-admin',
            type: 'group',
            label: 'Admin',
            icon: 'store.svg',
            expanded: false,
            badge: 'TC',
            children: [
              {
                id: 'item-portal-venues-list',
                type: 'main',
                label: 'Portal Venues List',
                icon: '',
                link: '#'
              },
              {
                id: 'item-franchise-groups',
                type: 'main',
                label: 'Franchise Groups',
                icon: '',
                link: '#'
              },
              {
                id: 'item-tablecheck-users',
                type: 'main',
                label: 'TableCheck Users',
                icon: '',
                link: '#'
              },
              {
                id: 'item-user-query',
                type: 'main',
                label: 'User Query',
                icon: '',
                link: '#'
              },
              {
                id: 'item-repeat-blocks',
                type: 'main',
                label: 'Repeat Blocks',
                icon: '',
                link: '#'
              },
              {
                id: 'item-app-notice',
                type: 'main',
                label: 'App Notice',
                icon: '',
                link: '#'
              },
              {
                id: 'item-sms-templates',
                type: 'main',
                label: 'SMS Templates',
                icon: '',
                link: '#'
              },
              {
                id: 'item-sms-prices',
                type: 'main',
                label: 'SMS Prices',
                icon: '',
                link: '#'
              },
              {
                id: 'item-payment-diagnostics',
                type: 'main',
                label: 'Payment Diagnostics',
                icon: '',
                link: '#'
              },
              {
                id: 'item-data-import',
                type: 'main',
                label: 'Data Import',
                icon: '',
                link: '#'
              },
              {
                id: 'item-crm-integration',
                type: 'main',
                label: 'CRM Integration',
                icon: '',
                link: '#'
              },
              {
                id: 'item-membership-programs',
                type: 'main',
                label: 'Membership Programs',
                icon: '',
                link: '#'
              },
              {
                id: 'item-pos-integration',
                type: 'main',
                label: 'POS Integration',
                icon: '',
                link: '#'
              },
              {
                id: 'item-chit-printers',
                type: 'main',
                label: 'Chit Printers',
                icon: '',
                link: '#'
              },
              {
                id: 'item-export-rules',
                type: 'main',
                label: 'Export Rules',
                icon: '',
                link: '#'
              },
              {
                id: 'item-saml-providers',
                type: 'main',
                label: 'SAML Providers',
                icon: '',
                link: '#'
              },
              {
                id: 'item-tablecheck-api',
                type: 'main',
                label: 'TableCheck API',
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

export const NavigationProvider = ({ children }) => {
  const [navigationData, setNavigationData] = useState(getInitialData);
  const [expandedGroups, setExpandedGroups] = useState({});

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
  const addSection = (name = 'New Section') => {
    if (navigationData.sections.length >= 3) {
      alert('Maximum of 3 sections allowed');
      return;
    }
    const newSection = {
      id: generateId(),
      name,
      items: []
    };
    setNavigationData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    return newSection;
  };

  // Update section name
  const updateSectionName = (sectionId, newName) => {
    setNavigationData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, name: newName } : section
      )
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
  const addGroup = (sectionId, label = 'New Group') => {
    const newGroup = {
      id: generateId(),
      type: 'group',
      label,
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
    return newGroup;
  };

  // Add main item
  const addMainItem = (sectionId, groupId = null, label = 'New Item') => {
    const newItem = {
      id: generateId(),
      type: 'main',
      label,
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
    return newItem;
  };

  // Update item (works for groups and main items)
  const updateItem = (itemId, updates) => {
    setNavigationData(prev => ({
      ...prev,
      sections: prev.sections.map(section => ({
        ...section,
        items: section.items.map(item => {
          if (item.id === itemId) {
            return { ...item, ...updates };
          }
          if (item.type === 'group' && item.children) {
            return {
              ...item,
              children: item.children.map(child =>
                child.id === itemId ? { ...child, ...updates } : child
              )
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

  const value = {
    navigationData,
    setNavigationData,
    expandedGroups,
    setExpandedGroups,
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
    findItemById
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

