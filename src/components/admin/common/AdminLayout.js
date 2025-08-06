import React from 'react';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-neutral-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-6 md:p-8">
          <div className="container mx-auto px-4 py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;