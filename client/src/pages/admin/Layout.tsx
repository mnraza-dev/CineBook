import React from 'react';
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <AdminNavbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:block md:w-64 bg-gray-900 text-white">
          <AdminSidebar />
        </div>
        <main className="flex-1 overflow-y-auto  bg-gray-900 text-white p-4 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
