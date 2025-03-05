import React, { useState } from "react";
import GetStartedBtn from "../forHeader/getStartedBtn";
import Logo from "../forHeader/Logo";
import Nav from "../forHeader/nav";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <Logo />

      {/* Navigation */}
      <Nav className={menuOpen ? "nav open" : "nav"} />

      {/* Get Started Button */}
      <GetStartedBtn />

      {/* Hamburger Menu for Mobile */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </header>
  );
}

export default Header;
