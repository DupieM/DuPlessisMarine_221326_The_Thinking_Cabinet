import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
      <nav className="navbar">
        <h1>CabinetAi</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/wunderchat-pre">Wunderchat</Link></li>
          <li><Link to="/cabinetAI-pre">CabinetAI</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>
    );
  };
  
  export default Navbar;