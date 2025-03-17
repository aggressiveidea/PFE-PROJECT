"use client";

import { useState } from "react";
import "./SettingsPage.css";
import { Lock, LogOut, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();

  // Password state
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Password visibility state
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value,
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  // Handle password update
  const handleUpdatePassword = (e) => {
    e.preventDefault();

    // Basic validation
    if (!password.current) {
      alert("Please enter your current password");
      return;
    }

    if (!password.new) {
      alert("Please enter a new password");
      return;
    }

    if (password.new !== password.confirm) {
      alert("New passwords don't match");
      return;
    }

    // Here you would typically make an API call to update the password
    // For now, we'll just show the success message

    // Reset form
    setPassword({
      current: "",
      new: "",
      confirm: "",
    });

    // Show success message
    const successMessage = document.createElement("div");
    successMessage.className = "settings-success-message";
    successMessage.textContent = "Password updated successfully!";
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      successMessage.classList.add("show");
      setTimeout(() => {
        successMessage.classList.remove("show");
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 300);
      }, 2000);
    }, 100);
  };

  // Handle form cancel
  const handleCancel = () => {
    // Reset form
    setPassword({
      current: "",
      new: "",
      confirm: "",
    });

    // Reset password visibility
    setShowPassword({
      current: false,
      new: false,
      confirm: false,
    });
  };

  // Handle logout
  const handleLogout = () => {
    // Show logout message
    const logoutMessage = document.createElement("div");
    logoutMessage.className = "settings-success-message logout-message";
    logoutMessage.textContent = "Logging out...";
    document.body.appendChild(logoutMessage);

    setTimeout(() => {
      logoutMessage.classList.add("show");
      setTimeout(() => {
        // Redirect to homepage
        navigate("/");
      }, 1000);
    }, 100);
  };

  return (
    <div className="settings-page">
      <div className="cross-pattern"></div>
      <div className="floating-dots">
        <div className="dot"></div>
      </div>
      <div className="settings-container">
        <h1 className="settings-title">Account Settings</h1>

        <div className="settings-card">
          <h2 className="settings-card-title">
            <Lock className="settings-card-icon" size={20} />
            Change Password
          </h2>
          <form className="settings-form" onSubmit={handleUpdatePassword}>
            <div className="settings-form-group">
              <label htmlFor="current" className="settings-label">
                Current Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword.current ? "text" : "password"}
                  id="current"
                  name="current"
                  value={password.current}
                  onChange={handlePasswordChange}
                  className="settings-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => togglePasswordVisibility("current")}
                  aria-label={
                    showPassword.current ? "Hide password" : "Show password"
                  }
                >
                  {showPassword.current ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="settings-form-group">
              <label htmlFor="new" className="settings-label">
                New Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword.new ? "text" : "password"}
                  id="new"
                  name="new"
                  value={password.new}
                  onChange={handlePasswordChange}
                  className="settings-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => togglePasswordVisibility("new")}
                  aria-label={
                    showPassword.new ? "Hide password" : "Show password"
                  }
                >
                  {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="settings-form-group">
              <label htmlFor="confirm" className="settings-label">
                Confirm New Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  id="confirm"
                  name="confirm"
                  value={password.confirm}
                  onChange={handlePasswordChange}
                  className="settings-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => togglePasswordVisibility("confirm")}
                  aria-label={
                    showPassword.confirm ? "Hide password" : "Show password"
                  }
                >
                  {showPassword.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="settings-form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="settings-button">
                Update Password
              </button>
            </div>
          </form>
        </div>

        <div className="logout-container">
          <p className="logout-description">Logout from your account</p>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} className="logout-icon" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
