import { Button } from "@/components/ui/button";
import { useResource } from "@/hooks/useResource";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
const menuLinks = [
  { label: "Movies", to: "/movies" },
  { label: "My Bookings", to: "/my-bookings" },
  { label: "Favorites", to: "/favorite" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const me = useResource<{ isAdmin: boolean }>(user ? "/me" : null);

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
          {me.data?.isAdmin && <Link to="/admin">Admin</Link>}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" aria-label="Search movies" onClick={() => navigate("/movies")}><SearchIcon /></Button>

          {!user ? (
            <Button
              onClick={() => openSignIn()}
              className="login-gradient-radial text-black px-6 py-1 rounded-lg hover:opacity-90 transition"
            >
              Login
            </Button>
          ) : (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Bookings"
                  labelIcon={<TicketPlus width={15} />}
                  onClick={() => {
                    navigate("/my-bookings");
                  }}
                />
              </UserButton.MenuItems>
            </UserButton>
          )}

          {/* Hamburger Icon */}
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" onClick={() => setIsOpen(true)}><MenuIcon /></Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 p-6 flex flex-col gap-6 text-white text-lg font-medium md:hidden">
          <div className="flex justify-between items-center mb-6">
            <img src={assets.logo} alt="Logo" className="w-24 h-auto" />
            <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setIsOpen(false)}><XIcon /></Button>
          </div>
          {renderMenuLinks(true)}
          {me.data?.isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)}>Admin</Link>}
          <Button
            className="login-gradient-radial text-black px-6 py-2 rounded-lg mt-4"
            onClick={() => { setIsOpen(false); openSignIn(); }}
          >
            Login
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
