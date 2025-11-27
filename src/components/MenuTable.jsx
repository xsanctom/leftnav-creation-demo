import React from 'react';
import { useMenu } from '../context/MenuContext';

function MenuTable({ onEditItem }) {
  const { state, deleteMenuItem } = useMenu();
  
  // Group items by category
  const groupedItems = state.menuItems.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Filter items based on search
  const filteredGroupedItems = Object.keys(groupedItems).reduce((acc, category) => {
    const filtered = groupedItems[category].filter(item =>
      item.name?.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  return (
    <div className="table-container" style={{ marginTop: '16px' }}>
      <table className="menu-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" className="header-checkbox" />
            </th>
            <th>Name</th>
            <th>Image</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(filteredGroupedItems).length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-subtle)' }}>
                No menu items found. Click "New" to add items.
              </td>
            </tr>
          ) : (
            Object.keys(filteredGroupedItems).map((category) => (
              <React.Fragment key={category}>
                {/* Category Header */}
                <tr className="category-header">
                  <td>
                    <input type="checkbox" className="category-checkbox" />
                  </td>
                  <td colSpan="7">
                    <div className="category-header-content">
                      <span className="category-tag">{category}</span>
                      <span className="category-count">
                        {filteredGroupedItems[category].length} items
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Items */}
                {filteredGroupedItems[category].map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input type="checkbox" className="row-checkbox" />
                    </td>
                    <td>
                      <div className="menu-name">
                        {item.name}
                      </div>
                    </td>
                    <td>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="menu-item-thumbnail" />
                      ) : (
                        <div style={{ width: '52px', height: '52px', background: 'var(--surface-low)', borderRadius: '4px' }}></div>
                      )}
                    </td>
                    <td>{item.description || '-'}</td>
                    <td className="price">¥{item.price || '0'}</td>
                    <td>
                      <span className="category-tag">{item.category}</span>
                    </td>
                    <td>
                      <span className={`status-tag status-${item.status?.toLowerCase() || 'online'}`}>
                        {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Online'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="icon-button" 
                          title="Edit"
                          onClick={() => onEditItem(item.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button 
                          className="icon-button" 
                          title="Delete"
                          onClick={() => deleteMenuItem(item.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MenuTable;

