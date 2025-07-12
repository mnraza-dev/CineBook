import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="h-[25vh] absolute bottom-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5  bg-primary/90">
      <Link to={"/"}>
        <img src={assets.logo} alt="Logo" className="w-24 h-auto" />
      </Link>
      <h1 className="text-logo-gradient text-4xl font-bold">
          Footer Goes Here
        </h1>
    </div>
  );
};

export default Footer;
