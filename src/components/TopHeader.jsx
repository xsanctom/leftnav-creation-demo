import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function TopHeader() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="top-header">
      <div className="top-header-content">
        <div className="language-switcher">
          <button
            className={`lang-button ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
            aria-label="Switch to English"
          >
            EN
          </button>
          <button
            className={`lang-button ${language === 'ja' ? 'active' : ''}`}
            onClick={() => setLanguage('ja')}
            aria-label="Switch to Japanese"
          >
            日本語
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
