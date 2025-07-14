import React from "react";
import { assets } from "../../assets/assets";
import { LayoutDashboardIcon } from "lucide-react";
import { ListIcon } from "lucide-react";
import { PlusSquareIcon } from "lucide-react";
import { ListCollapseIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const user = {
    firstName: "Admin",
    lastName: "User",
    imageUrl: assets.profile,
  };
  const adminNavLinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboardIcon },
    { name: "Add Shows", path: "/admin/add-shows", icon: PlusSquareIcon },
    { name: "List Shows", path: "/admin/list-shows", icon: ListIcon },
    {
      name: "List Bookings",
      path: "/admin/list-bookings",
      icon: ListCollapseIcon,
    },
  ];
  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
      <img
        className="h-9 md:h-14  w-9 md:w-14 rounded-full mx-auto"
        src={user.imageUrl}
        alt="sidebar"
      />
      <p className="mt-2 text-base max-md:hidden">
        {user.firstName} {user.lastName}{" "}
      </p>
      <div className="w-full">
        {adminNavLinks.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            className={({ isActive }) =>
              `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 rounded-md transition-colors duration-200
              ${isActive
                ? 'sidebar-active-gradient text-black font-semibold border-r-8 border-[#b99a45] shadow'
                : 'text-gray-500 hover:bg-[#f5ec9b] hover:text-black'}
              `
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="w-5 h-5" />
                <p className="max-md:hidden">{link.name}</p>
                {/* Right accent bar for active link */}
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-2 rounded-r bg-gradient-to-b from-[#223a5e] via-[#905e26] to-[#f5ec9b] shadow-lg"></span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
