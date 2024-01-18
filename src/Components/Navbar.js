import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "../Styles/Navbar.css";
import { Link } from "react-router-dom";
import { handleShowBot } from "../Store/redux";
import { useDispatch, useSelector } from 'react-redux';

function Navbar() {
  const [nav, setNav] = useState(false);
  const dispatch = useDispatch();
  const showBot = useSelector(state => state.chatBotSlice.showBot);

  const openNav = () => {
    setNav(!nav);
  };

  const navItems = [
    { href: "#", text: "Home" },
    { href: "#services", text: "Services" },
    { href: "#about", text: "About" },
    { href: "#reviews", text: "Reviews" },
    { href: "#contact", text: "Contact" },
    { href: "#doctors", text: "Doctors" },
  ];

  return (
    <div className="navbar-section">
      <h1 className="navbar-title">
        <Link to="/">
          Health <span className="navbar-sign">+</span>
        </Link>
      </h1>

      {/* Desktop */}
      <ul className="navbar-items">
        {navItems.map((item, index) => (
          <li key={index}>
            <a href={item.href} className="navbar-links">
              {item.text}
            </a>
          </li>
        ))}
      </ul>

      <button
        className="navbar-btn"
        type="button"
        onClick={() => { dispatch(handleShowBot()) }}
      >
        <FontAwesomeIcon icon={faCommentDots} /> {showBot ? 'Close Chat' : 'Open Chat'}
      </button>

      {/* Mobile */}

      <button
        className="mobile-bot-btn"
        type="button"
        onClick={() => { dispatch(handleShowBot()) }}
      >
        <FontAwesomeIcon icon={faCommentDots} /> {showBot ? 'Close Chat' : 'Open Chat'}
      </button>
      <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
        <div onClick={openNav} className="mobile-navbar-close">
          <FontAwesomeIcon icon={faXmark} className="hamb-icon" />
        </div>

        <ul className="mobile-navbar-links">
          {navItems.map((item, index) => (
            <li key={index}>
              <a onClick={openNav} href={item.href}>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Hamburger Icon */}
      <div className="mobile-nav">
        <FontAwesomeIcon
          icon={faBars}
          onClick={openNav}
          className="hamb-icon"
        />
      </div>
    </div>
  );
}

export default Navbar;
