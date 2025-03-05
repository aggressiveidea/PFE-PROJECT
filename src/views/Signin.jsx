import React from "react";
import Button from "../components/forSignup/Button";
import InputFeild from "../components/forSignup/InputFeild";
import CheckBox from "../components/forSignup/checkBox";
import SocialsignUp from "../components/forSignup/SocialMedia";
import image from "../assets/Innovation-pana.svg"
import '../App.css'
function Signup() {
  return (
    <div className="signUp">

      <div className="left">
        <h2>Sign in</h2>
        <div className="input-container">
        <InputFeild placeholder="Enter your email" className="usernameInput" type="email" />
        <InputFeild placeholder="Enter your password" type="password" />

        </div>
        <CheckBox />
        <Button text="Login" />
        <p className="or-text">
        <span className="line"></span> or Sign in with <span className="line"></span>
        </p>

        <SocialsignUp />
      </div>

      <div className="right">
        <img src={image} alt="Illustration" />
      </div>
    </div>
  );
}

export default Signup;
