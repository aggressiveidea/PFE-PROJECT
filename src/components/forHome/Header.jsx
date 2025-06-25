import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getUserById } from "../../services/Api";
import "./Header.css";

const Header = ({ language = "en", setLanguage, darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");

      if (storedUser) {
        const userData = JSON.parse(storedUser);

        if (userData._id && authData.token) {
          try {
            const freshUserData = await getUserById(userData._id);
            if (freshUserData) {
              const updatedUser = {
                ...userData,
                ...freshUserData,
                firstName: freshUserData.firstName || userData.firstName || "",
                lastName: freshUserData.lastName || userData.lastName || "",
                email: freshUserData.email || userData.email || "",
                profileImgUrl:
                  freshUserData.profileImgUrl || userData.profileImgUrl || "",
                role: freshUserData.role || userData.role || "User",
              };

              localStorage.setItem("user", JSON.stringify(updatedUser));
              setUser(updatedUser);
              console.log("Header: Updated user data from API:", updatedUser);
            } else {
              setUser(userData);
            }
          } catch (apiError) {
            console.error("Header: Error fetching fresh user data:", apiError);
            setUser(userData);
          }
        } else {
          setUser(userData);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Header: Error in loadUserData:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();

    const handleUserUpdate = () => {
      console.log("Header: User updated event received");
      loadUserData();
    };

    window.addEventListener("userUpdated", handleUserUpdate);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authData");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const getUserInitials = () => {
    if (!user) return "?";

    if (user.firstName || user.lastName) {
      const initials = [];
      if (user.firstName) initials.push(user.firstName[0]);
      if (user.lastName) initials.push(user.lastName[0]);
      return initials.join("").toUpperCase();
    }

    if (user.email) {
      return user.email[0].toUpperCase();
    }

    return "?";
  };

  const getDisplayName = () => {
    if (!user) return "Guest";

    if (user.name) return user.name;

    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }

    return user.email ? user.email.split("@")[0] : "Guest";
  };

  const translations = window.translations || {
    en: {
      home: "Home",
      about: "About",
      explore: "Explore",
      contact: "Contact",
    },
    fr: {
      home: "Accueil",
      about: "À propos",
      explore: "Explorer",
      contact: "Contact",
    },
    ar: {
      home: "الرئيسية",
      about: "حول",
      explore: "استكشاف",
      contact: "اتصل بنا",
    },
  };
  const t = translations[language] || translations.en;

  return (
    <header className={`header ${darkMode ? "dark" : ""}`}>
      <div className={`header-container ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="logo-section">
          <a href="/" className="logo">
            <div className="logo-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="24"
                  height="24"
                  rx="12"
                  fill="url(#paint0_linear)"
                />
                <path
                  d="M7.5 12L10.5 15L16.5 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="0"
                    y1="0"
                    x2="24"
                    y2="24"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#9333EA" />
                    <stop offset="1" stopColor="#C026D3" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span>EL-MOUGHITH</span>
          </a>
        </div>

        <div className="nav-section">
          <nav className="main-nav">
            {user && user.isVerified ? (
              <ul>
                <li>
                  <a href="/profile">Pannel</a>
                </li>
                <li>
                  <a href="/terms">Explore</a>
                </li>
                <li>
                  <a href="/dictionary">Knowledge graph</a>
                </li>
                <li>
                  <a href="/articles">Articles</a>
                </li>
                <li>
                  <a href="/faq">FAQ</a>
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  <a href="#home">{t.home}</a>
                </li>
                <li>
                  <a href="#about">{t.about}</a>
                </li>
                <li>
                  <a href="/terms">Explore</a>
                </li>
                <li>
                  <a href="/dictionary">Knowledge graph</a>
                </li>
                <li>
                  <a href="/faq">FAQ</a>
                </li>
              </ul>
            )}
          </nav>
        </div>

        <div className="user-section">
          {/* <div className="language-select-container">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-select">
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div> */}

          {loading ? (
            <div className="loading-indicator">Loading...</div>
          ) : user ? (
            <div className="user-controls" ref={dropdownRef}>
              <div className="user-info" onClick={toggleProfileDropdown}>
                <div className="user-avatar">
                  {user &&
                  user.profileImgUrl &&
                  !user.profileImgUrl.includes("placeholder.svg") ? (
                    <img
                      src={user.profileImgUrl || "/placeholder.svg"}
                      alt={getDisplayName()}
                      className="user-avatar-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.svg?height=40&width=40";
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <span
                    className="user-initials"
                    style={{
                      display:
                        user?.profileImgUrl &&
                        !user.profileImgUrl.includes("placeholder.svg")
                          ? "none"
                          : "flex",
                    }}
                  >
                    {getUserInitials()}
                  </span>
                </div>
                <span className="display-name">{getDisplayName()}</span>
                <span
                  className={`dropdown-arrow ${
                    isProfileDropdownOpen ? "open" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </div>

              {isProfileDropdownOpen && (
                <div className="profile-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>Profile</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item danger"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              {user && user.isVerified ? (
                <Link to="/login">
                  <button className="lib-btn">Digital Library</button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <button className="btn-signup">Sign up</button>
                  </Link>
                  <Link to="/login">
                    <button className="btn-login">Login</button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            {user && user.isVerified ? (
              <ul>
                <li>
                  <a href="/profile">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Profile
                  </a>
                </li>

                <li>
                  <a href="/library">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    Library
                  </a>
                </li>
                <li>
                  <a href="/dictionary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Terms
                  </a>
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  <a href="#home">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    {t.home}
                  </a>
                </li>
              </ul>
            )}
          </nav>

          {user && (
            <div className="mobile-profile-section">
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">
                  {user.profileImgUrl &&
                  !user.profileImgUrl.includes("placeholder.svg") ? (
                    <img
                      src={user.profileImgUrl || "/placeholder.svg"}
                      alt={getDisplayName()}
                    />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </div>
                <div className="mobile-user-details">
                  <span className="mobile-display-name">
                    {getDisplayName()}
                  </span>
                  <span className="mobile-user-email">{user.email}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="mobile-logout-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
