import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';

function InternalView({ onEditItem }) {
  const { state, setSearch } = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearch(query);
  };

  const filteredItems = state.menuItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const isAllSelected = filteredItems.length > 0 && selectedItems.length === filteredItems.length;

  return (
    <div className="internal-view">
      {/* Search Bar */}
      <div className="internal-search-bar">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Internal Items Table */}
      <div className="table-container">
        <table className="menu-table internal-table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  className="header-checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <input 
                    type="checkbox" 
                    className="row-checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                  />
                </td>
                <td onClick={() => onEditItem(item.id)} style={{ cursor: 'pointer' }}>
                  <div className="menu-name">
                    <strong>{item.name}</strong>
                  </div>
                </td>
                <td>
                  <span className="category-tag">{item.category}</span>
                </td>
                <td>
                  <span className={`status-tag ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InternalView;
