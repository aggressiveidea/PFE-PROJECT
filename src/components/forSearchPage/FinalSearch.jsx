import React from 'react'
import Addbtn from './Addbtn'
import TypeSelection from './TypeSelection'
import SearchInput from './searchInput'
import '../../App.css'
function FinalSearch() {
  return (
    <div className='underHeader'>
        <SearchInput className = 'first'></SearchInput>
        <TypeSelection className ='second'></TypeSelection>
        <Addbtn className = 'third'></Addbtn>
    </div>
  )
}

export default FinalSearch