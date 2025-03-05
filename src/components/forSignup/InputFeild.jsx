import React from 'react';

function InputField({ name, placeholder, type, value, onChange }) {
  return (
    <input
      
      className='logininput'
      type={type}
      name={name} 
      placeholder={placeholder}
      value={value} 
      onChange={onChange} 
    />
  );
}

export default InputField;
