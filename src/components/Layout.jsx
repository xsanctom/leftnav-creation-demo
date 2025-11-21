import React from 'react';
import { NavigationProvider } from '../context/NavigationContext';
import TopHeader from './TopHeader';
import Sidebar from './Sidebar';
import PageHeader from './PageHeader';
import MainContent from './MainContent';

function Layout() {
  return (
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
  );
}

export default Layout;
