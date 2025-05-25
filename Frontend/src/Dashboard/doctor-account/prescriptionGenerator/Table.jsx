import React from 'react'

const Table = ({list,setList}) => {
  return (
    <>
        <table width="100%" className='mb-10 '>
            <thead>
                <tr className='bg-gray-100'>
                <th className='font-bold'>Prescribed Medicine</th>
                <th className='font-bold'>Dosage</th>
                <th    className='font-bold'>Duration</th>
                </tr>
            </thead>
            {list.map(({id,medicine, dosage, duration})=>{
                return <React.Fragment key={id}>
                <tbody>
                    <tr>
                        <td className='text-s text-center border border-1 border-gray-400'>{medicine}</td>
                        <td className='text-s text-center border border-1 border-gray-400'>{dosage}</td>
                        <td className='text-s text-center border border-1 border-gray-400'>{duration}</td>
                    </tr>
                </tbody>
                </React.Fragment>
            })} 

        </table>
    </>
  )
}

export default Table