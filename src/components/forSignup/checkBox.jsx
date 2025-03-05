import React from 'react';

function CheckBox({ name, checked, onChange }) {
  return (
    <div className='container'>
      <input
        type="checkbox"
        name={name}
        id={name}
        className='check'
        checked={checked}
        onChange={onChange} 
      />
      <p className='textcheck'>
        I agree to the <a className='link' href="#">terms of service</a> and <a href="#" className='link'>privacy policy</a>
      </p>
    </div>
  );
}

export default CheckBox;
