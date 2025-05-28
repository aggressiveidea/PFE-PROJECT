<<<<<<< Updated upstream
import { useState, useEffect } from "react"
import { Lock, User, ArrowRight, Key, Shield } from "lucide-react"
import { Link } from "react-router-dom"
import "./AccessLock.css"
=======
import React, { useState, useEffect } from "react";
import { Lock, User, ArrowRight, Key, Shield } from "lucide-react";
import "./AccessLock.css";
>>>>>>> Stashed changes

const AccessLock = ({ onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
<<<<<<< Updated upstream
    //after mount
    setIsAnimating(true)
=======
    // Start animation after component mounts
    setIsAnimating(true);
>>>>>>> Stashed changes

    const timer = setTimeout(() => {
      setShowSignup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSignupClick = () => {
    // Handle signup navigation - replace with your routing logic
    window.location.href = "/signup";
  };

  const handleLoginClick = () => {
    // Handle login navigation - replace with your routing logic
    window.location.href = "/login";
  };

  return (
    <div className="_access_lock_overlay">
      <div className={`_access_lock_container ${isAnimating ? "animate" : ""}`}>
        <div className="_access_lock_content">
          <div className="_access_lock_icon_container">
            <div className="_access_lock_icon_wrapper">
              <Lock className="_access_lock_icon" size={48} strokeWidth={1.5} />
              <div className="_access_lock_pulse"></div>
            </div>
          </div>

          <h2 className="_access_lock_title">Restricted Access</h2>
          <p className="_access_lock_description">
            This knowledge graph visualization is available exclusively to
            verified users.
          </p>

          <div className="_access_lock_features">
            <div className="_access_lock_feature_item">
              <div className="_access_lock_feature_icon">
                <Shield size={24} />
              </div>
              <div className="_access_lock_feature_text">
                <h3>Premium Content</h3>
                <p>Access our comprehensive ICT knowledge graph</p>
              </div>
            </div>
            <div className="_access_lock_feature_item">
              <div className="_access_lock_feature_icon">
                <Key size={24} />
              </div>
              <div className="_access_lock_feature_text">
                <h3>Interactive Tools</h3>
                <p>Explore relationships between ICT concepts</p>
              </div>
            </div>
            <div className="_access_lock_feature_item">
              <div className="_access_lock_feature_icon">
                <User size={24} />
              </div>
              <div className="_access_lock_feature_text">
                <h3>Personalized Experience</h3>
                <p>Save your progress and customize your learning</p>
              </div>
            </div>
          </div>

          {showSignup && (
            <div className="_access_lock_actions">
              <button
                onClick={handleSignupClick}
                className="_access_lock_signup_button"
              >
                <span>Sign Up Now</span>
                <ArrowRight size={18} />
              </button>
              <button
                onClick={handleLoginClick}
                className="_access_lock_login_link"
              >
                Already have an account? Log in
              </button>
            </div>
          )}
        </div>

        <div className="_access_lock_decoration">
          <div className="_access_lock_decoration_circle _access_lock_circle_1"></div>
          <div className="_access_lock_decoration_circle _access_lock_circle_2"></div>
          <div className="_access_lock_decoration_circle _access_lock_circle_3"></div>
          <div className="_access_lock_decoration_line _access_lock_line_1"></div>
          <div className="_access_lock_decoration_line _access_lock_line_2"></div>
          <div className="_access_lock_decoration_line _access_lock_line_3"></div>
          <div className="_access_lock_decoration_dot _access_lock_dot_1"></div>
          <div className="_access_lock_decoration_dot _access_lock_dot_2"></div>
          <div className="_access_lock_decoration_dot _access_lock_dot_3"></div>
          <div className="_access_lock_decoration_dot _access_lock_dot_4"></div>
          <div className="_access_lock_decoration_dot _access_lock_dot_5"></div>
        </div>
      </div>
    </div>
  );
};

export default AccessLock;
