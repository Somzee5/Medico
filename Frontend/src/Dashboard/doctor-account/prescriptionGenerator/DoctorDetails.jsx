import React from 'react'

const DoctorDetails = ({doctorName, hospitalName, hospitalAdd, hospitalContact}) => {
  return (
    <>
        <div className="flex flex-col items-end justify-end">
          <div>
            <h2 className="font-bold text-xl uppercase">Dr.{doctorName}</h2>
            <p>{hospitalName}</p>
            <p className="text-xs">{hospitalAdd}</p>
            <p className='text-xs'>contact:{hospitalContact}</p>
          </div>
          
        </div>
    </>
  )
}

export default DoctorDetails