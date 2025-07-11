import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon } from "lucide-react";
const Navbar = () => {
  return (
    <header className="sticky top-0 left-0 z-50 w-full flex px-6 md:px-16 lg:px-36 py-5 bg-primary/90">
      <nav className="flex items-center justify-between w-full">
        <Link className="max-md:flex-1" to="/">
          <img src={assets.logo} alt="Logo" className="w-24 h-auto" />
        </Link>
        <div className="flex gap-6 items-center text-white font-medium">
          <Link to="/movies">Movies</Link>
          <Link to="/my-bookings">My Bookings</Link>
          <Link to="/favorite">My Favorites</Link>
        </div>
        <div className="flex items-center gap-4">
          <SearchIcon className="w-6 h-6 max-md:hidden cursor-pointer" />
          {/* <Link to="/login" className="text-white">
            Login
          </Link> */}
          <button className="bg-secondary text-white px-6 py-1 cursor-pointer rounded hover:bg-primary-light/80 transition">
           Login
          </button>
        </div>

        <MenuIcon className="max-md:ml-4 w-8 h-8 cursor-pointer md:hidden" />
      </nav>
    </header>
  );
};

export default Navbar;
