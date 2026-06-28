import React from 'react';
import Header from './Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] bg-grid">
      <Header />
      <div style={{ paddingTop: '100px' }} className="px-2 md:px-4 lg:px-6 pb-8 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;