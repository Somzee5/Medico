import React from 'react'

const Notes = ({notes, followUp}) => {
  return (
    <>
    <div className="mt-10 mb-5">
        {/* textarea */}
        <span className='font-thin'>Note from your doctor:</span>
        <p className='px-4 py-2 lg:w-1/2 text-justify'>{notes}</p>
        <p className="text-xs font-bold bg-gray-100 p-1"><span className='font-bold'>Follow up:</span> {followUp}</p>
    </div>
    </>
  )
}

export default Notes