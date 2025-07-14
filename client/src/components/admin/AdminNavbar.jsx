import React from "react";
import { Link } from "react-router-dom";
import {assets} from "../../assets/assets"

const AdminNavbar = () => {
  return <div>
    <Link to={"/"} >
    <img src={assets.logo} alt="" className="src" />
    </Link>
  </div>;
};

export default AdminNavbar;
