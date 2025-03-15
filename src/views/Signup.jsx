import React, { useState } from "react";
import Button from "../components/forSignup/Button";
import InputField from "../components/forSignup/InputFeild";
import CheckBox from "../components/forSignup/checkBox";
import AlertBox from "../components/alertBox";
import image from "../assets/Visionary technology-amico (1).svg";
import { handleChange } from "../utils/handleChange";
import { registerUser, getProfile } from "../services/Api"; 

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

    const handleSubmit = async (e) => {
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
    
        try {
            // Simulating user registration (no backend)
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
            };
    
            // Store user data in localStorage
            localStorage.setItem("user", JSON.stringify(userData));
    
            // Navigate to profile page after signup
            SetallertMessage("Registration successful! Welcome there!");
            setTimeout(() => {
                window.location.href = "/profile"; // Redirect to profile
            }, 1000);
    
        } catch (error) {
            console.error("Registration failed:", error);
            SetallertMessage(error.message || "Registration failed. Try again.");
        }
    };
    
    return (
        <div className="signUp">
            <AlertBox message={alertMessage} onClose={() => SetallertMessage("")} />
            <div className="layout-container">
                <div className="left-section">
                    <h2>Sign Up</h2>
                    <p>Create your account to get started.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <InputField placeholder="Enter your first name" name="firstName" value={formData.firstName} onChange={(e) => handleChange(e, setformData)} />
                            <InputField placeholder="Enter your last name" name="lastName" value={formData.lastName} onChange={(e) => handleChange(e, setformData)} />
                            <InputField placeholder="Enter your email" type="email" name="email" value={formData.email} onChange={(e) => handleChange(e, setformData)} />
                            <InputField placeholder="Create a password" type="password" name="password" value={formData.password} onChange={(e) => handleChange(e, setformData)} />
                            <InputField placeholder="Confirm password" type="password" name="passwordConfirmed" value={formData.passwordConfirmed} onChange={(e) => handleChange(e, setformData)} />
                        </div>

                        <div className="checkbox-container">
                            <CheckBox label="I agree to the terms of service and privacy policy" name="boxchecked" checked={formData.boxchecked} onChange={(e) => handleChange(e, setformData)} />
                        </div>

                        <Button text="Sign Up" type="submit" />
                    </form>

                    <p className="or-text">
                        <span className="line"></span> or Sign up with <span className="line"></span>
                    </p>

                    <p className="signin-link">
                        Already have an account? <a href="/signin">Sign in</a>
                    </p>
                </div>

                <div className="right-section">
                    <img src={image} alt="Illustration" className="form-image" />
                </div>
            </div>
        </div>
    );
}

export default Signup;

