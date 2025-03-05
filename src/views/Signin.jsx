import React, { useState } from "react";
import Button from "../components/forSignup/Button";
import InputFeild from "../components/forSignup/InputFeild";
import CheckBox from "../components/forSignup/checkBox";
import SocialsignUp from "../components/forSignup/SocialMedia";
import image from "../assets/Innovation-pana.svg";
import '../App.css';
import AlertBox from "../components/alertBox";
import { handleChange } from "../utils/handleChange";
function Signup() {
  const [existData, setExistData] = useState({
    email: "",
    password: "",
    checkedInfo: false,
  });

  const [alertMessage, setAlertMessage] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!existData.email.trim() || !existData.password.trim()) {
      setAlertMessage("All fields are required");
      return;
    }

    console.log("Form submitted successfully", existData);
    setExistData({ email: "", password: "", checkedInfo: false }); // Clear inputs after submission
  };

  return (
    <div className="signUp">
      <div className="left">
        <h2>Sign in</h2>

        {alertMessage && <AlertBox message={alertMessage} onClose={() => setAlertMessage("")} />}

        {/* Form to handle submission */}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <InputFeild
              placeholder="Enter your email"
              className="usernameInput"
              type="email"
              name="email"
              value={existData.email}
              onChange={(e) => {handleChange(e, setExistData)}} 
            />
            <InputFeild
              placeholder="Enter your password"
              type="password"
              name="password"
              value={existData.password}
              onChange={(e) => {handleChange(e, setExistData)}} 
            />
          </div>

          <CheckBox name="checkedInfo" checked={existData.checkedInfo} onChange={(e) => {handleChange(e, setExistData)}} />

          <Button text="Login" type="submit" />
        </form>

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
