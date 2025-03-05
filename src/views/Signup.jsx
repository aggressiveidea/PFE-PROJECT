import React from "react";
import Button from "../components/forSignup/Button";
import InputFeild from "../components/forSignup/InputFeild";
import CheckBox from "../components/forSignup/checkBox";
import SocialsignUp from "../components/forSignup/SocialMedia";
import image from "../assets/Visionary technology-rafiki.svg"
import '../App.css'
function Signup() {
  return (
    <div className="signUp">

      <div className="left">
        <h2>Sign in</h2>
        <div className="input-container">
          <InputFeild placeholder="Username" />
          <InputFeild placeholder="Password" type="password" />
        </div>
        <CheckBox />
        <Button text="Login" />
        <p className="or-text">or Sign in with</p>
        <SocialsignUp />
      </div>

      <div className="right">
        <img src={image} alt="Illustration" />
      </div>
    </div>
  );
}

export default Signup;
