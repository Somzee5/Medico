import React from 'react'

const ClientDetails = ({patientName, patientAdd, patientAge, patientSex}) => {
  return (
    <>
        <div className="mt-5">
            <p className='text-xs'>patient name: <span className="text-xl uppercase font-bold">{patientName}</span></p>
            <div className="flex gap-5">
              <p className="text-xs">sex:{patientSex} </p>
              <p className="text-xs">age:{patientAge} </p>
            </div>
            <p className="text-xs">{patientAdd}</p>
        </div>
    </>
  )
}

export default ClientDetails