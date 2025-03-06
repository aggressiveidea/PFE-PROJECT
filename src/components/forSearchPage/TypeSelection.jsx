import React, { useState } from 'react'

function TypeSelection() {
    const [Option, setOption] = useState();
    const handleChange = (e) =>{
        setOption(e.target.value);
    }
  return (
    <div>
        <select name="" id="" className='selection' onChange={handleChange}>
            <option value="disabled" hidden>Select an option</option>
            <option value="simple" >simple research</option>
            <option value="indexed">indexed research</option>
            <option value="category">search by category</option>
            <option value="advanced">advanced research</option>
            {/* pour le moment nkhdamou haka mmba3d twli conditional render */}
            {console.log(Option)}
        </select>
        
    </div>
    
  )
}

export default TypeSelection