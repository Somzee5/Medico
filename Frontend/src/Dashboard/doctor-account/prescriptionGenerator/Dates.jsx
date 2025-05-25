import React from 'react'

const Dates = ({currentDate}) => {
  return (
    <>
        <article className="my-5 flex items-end justify-end">
            <ul>
              <li className='bg-gray-100 p-1'><span className="font-bold">Date:</span>{currentDate}</li>
            </ul>
        </article>
    </>
  )
}

export default Dates