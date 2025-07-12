import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 left-0 z-50 w-full flex px-6 md:px-16 lg:px-36 py-5 ">
      <nav className="flex items-center justify-between w-full">
        <Link className="max-md:flex-1" to="/">
          <img src={assets.logo} alt="Logo" className="w-24 h-auto" />
        </Link>

        {/* Navigation Menu - Styled Parent */}
        <div className="flex gap-6 items-center text-white font-medium max-md:hidden bg-white/10  transition rounded-full px-6 py-2">
          <Link to="/movies">Movies</Link>
          <Link to="/theaters">Theaters</Link>
          <Link to="/releases">Releases</Link>
          <Link to="/my-bookings">My Bookings</Link>
          <Link to="/favorite">Favorites</Link>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          <SearchIcon className="w-6 h-6 max-md:hidden cursor-pointer text-white" />
          <button className=" cursor-pointer login-gradient-radial text-black px-6 py-1 rounded-lg hover:opacity-90 transition">
            Login
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <MenuIcon className="max-md:ml-4 w-8 h-8 cursor-pointer md:hidden text-white" />
      </nav>
    </header>
  );
};

export default Navbar;
