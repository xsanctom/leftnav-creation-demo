import React from 'react';
import { useNavigation } from '../context/NavigationContext';

function PageHeader() {
  const { navigationData, setNavigationData } = useNavigation();

  const handleExport = () => {
    const dataStr = JSON.stringify(navigationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'navigation-structure.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            if (window.confirm('Import this navigation structure? This will replace your current structure. Note: Changes are temporary and will reset on refresh.')) {
              setNavigationData(imported);
            }
          } catch (error) {
            alert('Error importing file. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="page-header">
      <div className="page-header-content">
        <div className="page-title-section">
          <h1 className="page-title">Navigation Structure</h1>
        </div>
        <div className="page-actions">
          <button
            onClick={handleExport}
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
            Export JSON
          </button>
          <button
            onClick={handleImport}
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
            Import JSON
          </button>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
