import React from "react";
import Button from "../components/forSignup/Button";
import InputField from "../components/forSignup/InputFeild";
import CheckBox from "../components/forSignup/checkBox";
import SocialSignUp from "../components/forSignup/SocialMedia";
import image from "../assets/Visionary technology-amico (1).svg";
import "../App.css";

function Signup() {
  return (
    <div className="signUp">
      <div className="left">
        <h2>Sign Up</h2>
        <p>Create your account to get started.</p>
        <div className="input-container">
          <InputField placeholder="Enter your first name" />
          <InputField placeholder="Enter your last name" />
          <InputField placeholder="Enter your email" type="email" />
          <InputField placeholder="Create a password" type="password" />
          <InputField placeholder="Confirm password" type="password" />
        </div>
        <CheckBox label="I agree to the Terms & Conditions" />
        <Button text="Sign Up" />
        <p className="or-text">
          <span className="line"></span> or Sign up with{" "}
          <span className="line"></span>
        </p>
        <p className="signin-link">
          Already have an account? <a href="/signin">Sign in</a>
        </p>
      </div>

      <div className="right">
        <img src={image} alt="Illustration" />
      </div>
    </div>
  );
}

export default Signup;
