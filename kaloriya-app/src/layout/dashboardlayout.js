import React from 'react';
import Sidebar from '../component/sidebar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}