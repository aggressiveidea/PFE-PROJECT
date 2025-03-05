import React from "react";

const AlertBox = ({ message, onClose }) => {
    if(!message) {
        return null;
    }
  return (
    <div className="alert-overlay">
      <div className="alert-box">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default AlertBox;
