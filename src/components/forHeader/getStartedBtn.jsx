import React from 'react'

function getStartedBtn({displayedText}) {
  return (
    <div>
        <button className='getStarted'>
            {displayedText}
        </button>
    </div>
  )
}

export default getStartedBtn