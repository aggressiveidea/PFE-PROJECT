import React, { useState } from "react";
import GetStartedBtn from "../forHeader/getStartedBtn";
import Logo from "../forHeader/Logo";
import Nav from "../forHeader/nav";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <Logo className = "Logoimg"></Logo>
      <nav className={menuOpen ? "nav open" : "nav"}>
      <Nav className = "navLinks"></Nav>
      </nav>
      <GetStartedBtn className = "toStartBtn" displayedText = "Get started" ></GetStartedBtn>
      <GetStartedBtn className = "toStartBtn" displayedText = "About us" ></GetStartedBtn>
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </header>
  );
}

export default Header;
