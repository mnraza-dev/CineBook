import React, { useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";

const menuLinks = [
  { label: "Movies", to: "/movies" },
  { label: "Theaters", to: "/theaters" },
  { label: "Releases", to: "/releases" },
  { label: "My Bookings", to: "/my-bookings" },
  { label: "Favorites", to: "/favorite" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const renderMenuLinks = (isMobile = false) =>
    menuLinks.map(({ label, to }) => (
      <Link
        key={label}
        to={to}
        onClick={() => isMobile && setIsOpen(false)}
        className="hover:opacity-80 transition"
      >
        {label}
      </Link>
    ));

  return (
    <header className="sticky top-0 left-0 z-50 w-full flex px-6 md:px-16 lg:px-36 py-5 ">
      <nav className="flex items-center justify-between w-full">

        {/* Logo */}
        <Link to="/" className="max-md:flex-1">
          <img src={assets.logo} alt="Logo" className="w-24 h-auto" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center text-white font-medium bg-white/10 rounded-full px-6 py-2">
          {renderMenuLinks()}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <SearchIcon className="w-6 h-6 max-md:hidden cursor-pointer text-white" />
          <button className="login-gradient-radial text-black px-6 py-1 rounded-lg hover:opacity-90 transition">
            Login
          </button>

          {/* Hamburger Icon */}
          <MenuIcon
            className="md:hidden w-8 h-8 cursor-pointer text-white"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 p-6 flex flex-col gap-6 text-white text-lg font-medium md:hidden">
          <div className="flex justify-between items-center mb-6">
            <img src={assets.logo} alt="Logo" className="w-24 h-auto" />
            <XIcon
              className="w-8 h-8 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>
          {renderMenuLinks(true)}
          <button
            className="login-gradient-radial text-black px-6 py-2 rounded-lg mt-4"
            onClick={() => setIsOpen(false)}
          >
            Login
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
