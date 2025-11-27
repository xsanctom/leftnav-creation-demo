import React from 'react';
import { MenuProvider } from './context/MenuContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import ToastContainer from './components/ToastContainer';
import { useToast } from './context/ToastContext';

function AppContent() {
  const { toasts, removeToast } = useToast();
  
  return (
    <>
      <Layout />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <MenuProvider>
        <AppContent />
      </MenuProvider>
    </ToastProvider>
  );
}

export default App;

