import React from 'react';
import { LanguageProvider } from '../context/LanguageContext';
import { NavigationProvider } from '../context/NavigationContext';
import TopHeader from './TopHeader';
import Sidebar from './Sidebar';
import PageHeader from './PageHeader';
import MainContent from './MainContent';

function Layout() {
  return (
    <LanguageProvider>
      <NavigationProvider>
        <TopHeader />
        <div className="main-layout">
          <Sidebar />
          <div className="content-area">
            <PageHeader />
            <MainContent />
          </div>
        </div>
      </NavigationProvider>
    </LanguageProvider>
  );
}

export default Layout;
