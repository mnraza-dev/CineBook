import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets'
import {
  LayoutDashboardIcon,
  PlusCircleIcon,
  ListIcon,
  CalendarCheckIcon
} from "lucide-react";
const AdminSidebar = () => {

  const user = {
    firstName: "Admin",
    lastName: "User",
    imageURL: assets.profile,
  }
  const adminNavLinks = [
    {
      id: 1,
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      id: 2,
      name: "Add Shows",
      path: "/admin/add-shows",
      icon: PlusCircleIcon,
    },
    {
      id: 3,
      name: "List Shows",
      path: "/admin/list-shows",
      icon: ListIcon,
    },
    {
      id: 4,
      name: "List Bookings",
      path: "/admin/list-bookings",
      icon: CalendarCheckIcon,
    },
  ];
  return (
    <div className='h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm'>
      <img src={user.imageURL} alt="Sidebar" className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto' />
      <p className='mt-2 text-base max-md:hidden '>
        {user.firstName} {user.lastName}
      </p>
      <div className="w-full mt-4 space-y-2">
        {adminNavLinks.map((link) => (
          <NavLink
            key={link.id}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3  transition-all duration-200 border-r-5
        ${isActive
                ? "text-logo-gradient shadow-md border-[#905e26] login-gradient"
                : "bg-gray-800/60 text-gray-300 hover:bg-gray-700 hover:text-white border-transparent"
              }`
            }
          >

            {({ isActive }) => (
              <>
                <link.icon
                  className={`w-5 h-5 ${isActive ? 'text-[#905e26]' : 'text-white'}`}
                />
                <span className="font-medium">{link.name}</span>
              </>
            )}

          </NavLink>
        ))}
      </div>




    </div>
  )
}
export default AdminSidebar