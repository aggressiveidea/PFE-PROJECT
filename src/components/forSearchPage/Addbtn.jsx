import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
function Addbtn() {
  return (
    <button className='Addingbtn'>
         <FontAwesomeIcon icon={faPlus} />
        <span className='btnText'>Add</span>
    </button>
  )
}

export default Addbtn