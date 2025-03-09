import React, { useState } from "react";
import Button from "../components/forSignup/Button";
import InputField from "../components/forSignup/InputFeild";
import CheckBox from "../components/forSignup/checkBox";
import image from "../assets/Visionary technology-amico (1).svg"; // Your existing image
import "../App.css";
import AlertBox from "../components/alertBox";
import { handleChange } from "../utils/handleChange";

function Signup() {
  const [formData, setformData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmed: "",
    boxchecked: false,
  });

  const [alertMessage, SetallertMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.passwordConfirmed.trim()
    ) {
      SetallertMessage("All fields are required!");
      return;
    }

    if (formData.password !== formData.passwordConfirmed) {
      SetallertMessage("Passwords do not match!");
      return;
    }

    if (!formData.boxchecked) {
      SetallertMessage("You must agree to the Terms & Conditions to sign up.");
      return;
    }

    console.log("Form submitted successfully:", formData);

    setformData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmed: "",
      boxchecked: false,
    });
  };

  return (
    <div className="signUp">
      <AlertBox message={alertMessage} onClose={() => SetallertMessage("")} />
      <div className="layout-container">
        {/* Left Section: Form */}
        <div className="left-section">
          <h2>Sign Up</h2>
          <p>Create your account to get started.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <InputField
                placeholder="Enter your first name"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange(e, setformData)}
              />
              <InputField
                placeholder="Enter your last name"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange(e, setformData)}
              />
              <InputField
                placeholder="Enter your email"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e, setformData)}
              />
              <InputField
                placeholder="Create a password"
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleChange(e, setformData)}
              />
              <InputField
                placeholder="Confirm password"
                type="password"
                name="passwordConfirmed"
                value={formData.passwordConfirmed}
                onChange={(e) => handleChange(e, setformData)}
              />
            </div>

            <div className="checkbox-container">
              <CheckBox
                label="I agree to the terms of service and privacy policy"
                name="boxchecked"
                checked={formData.boxchecked}
                onChange={(e) => handleChange(e, setformData)}
              />
            </div>

            <Button text="Sign Up" type="submit" />
          </form>

          <p className="or-text">
            <span className="line"></span> or Sign up with{" "}
            <span className="line"></span>
          </p>

          <p className="signin-link">
            Already have an account? <a href="/signin">Sign in</a>
          </p>
        </div>

        {/* Right Section: Image */}
        <div className="right-section">
          <img src={image} alt="Illustration" className="form-image" />
        </div>
      </div>
    </div>
  );
}

export default Signup;

