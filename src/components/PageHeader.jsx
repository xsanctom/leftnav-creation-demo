import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

function PageHeader() {
  const { navigationData, setNavigationData, clearAll } = useNavigation();
  const { language } = useLanguage();
  const toast = useToast();
  
  const translations = {
    en: {
      title: 'Navigation Structure',
      clearAll: 'Clear all',
      clearAllConfirm: 'Are you sure you want to clear all sections, groups, and items? This action cannot be undone.',
      clearAllSuccess: 'All navigation data has been cleared.',
      export: 'Export JSON',
      import: 'Import JSON',
      importConfirm: 'Import this navigation structure? This will replace your current structure. Note: Changes are temporary and will reset on refresh.',
      importError: 'Error importing file. Please check the file format.'
    },
    ja: {
      title: 'ナビゲーション構造',
      clearAll: 'すべてクリア',
      clearAllConfirm: 'すべてのセクション、グループ、アイテムをクリアしてもよろしいですか？この操作は元に戻せません。',
      clearAllSuccess: 'すべてのナビゲーションデータがクリアされました。',
      export: 'JSONエクスポート',
      import: 'JSONインポート',
      importConfirm: 'このナビゲーション構造をインポートしますか？現在の構造が置き換えられます。注意：変更は一時的で、ページを更新するとリセットされます。',
      importError: 'ファイルのインポートエラー。ファイル形式を確認してください。'
    }
  };
  
  const t = translations[language] || translations.en;

  const handleClearAll = () => {
    if (window.confirm(t.clearAllConfirm)) {
      clearAll();
      toast.success(t.clearAllSuccess);
    }
  };

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
            if (window.confirm(t.importConfirm)) {
              setNavigationData(imported);
            }
          } catch (error) {
            alert(t.importError);
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
          <h1 className="page-title">{t.title}</h1>
        </div>
        <div className="page-actions">
          <button
            onClick={handleClearAll}
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
            {t.clearAll}
          </button>
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
            {t.export}
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
            {t.import}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
