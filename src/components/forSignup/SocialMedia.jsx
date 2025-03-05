import React from "react";
import { FaGoogle, FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";


function SocialLogin() {
  return (
    <div className="social-container">
      <div className="social-icons">
        <FaGoogle className="google" />
        <FaFacebookF className="facebook" />
        <FaXTwitter className="twitter" />
        <FaInstagram className="instagram" />
        <FaLinkedinIn className="linkedin" />
      </div>
      <p className="signup-text">
        You don’t have an account? <a href="#">Sign up</a>
      </p>
    </div>
  );
}

export default SocialLogin;
