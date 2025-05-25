import React, { useState, useEffect } from 'react'
import {v4 as uuidv4} from 'uuid' 
import {AiOutlineDelete, AiOutlineEdit} from "react-icons/ai"

const TableForm = ({medicine, setMedicine, dosage,setDosage,duration,setDuration,list,setList}) => {
    const [isEditing, setIsEditing] = useState(false)

    const handleSubmit = (e)=>{
        e.preventDefault()
        if(!medicine || !dosage || !duration){
                alert("Please enter all inputs")
        }else{
            setIsEditing(false)
            const newItem = {
                id: uuidv4(),
                medicine,
                dosage,
                duration,
            }
            setMedicine("")
            setDosage("")
            setDuration("")
            setList((prevList) => [...prevList, newItem]);
            
        }
    }

    //edit function
    const editRow = (id)=>{
        setIsEditing(true)
        const editingRow = list.find((row)=> row.id === id);
        setList(list.filter((row)=> row.id != id))
        setIsEditing(true);
        setMedicine(editingRow.medicine)
        setDosage(editingRow.dosage)
        setDuration(editingRow.duration)
        
    }

    //delete function
    const deleteRow = (id)=>{
        setList(list.filter((row)=> row.id != id))
    }
    
    return (
    <>
        <form onSubmit={handleSubmit}>
            <div className="mt-20 grid lg:grid-cols-3 gap-5 md:grid-cols-2 sm:grid-cols-1">
                <div className='flex flex-col'>
                    <label htmlFor='medicine'>Medicine: </label>
                    <input 
                        type='text' 
                        id='medicine' 
                        name='medicine' 
                        placeholder='Medicine' 
                        value={medicine}
                        onChange={(e)=>{setMedicine(e.target.value)}} 
                    />   
                </div>

                <div className='flex flex-col'>
                    <label htmlFor='dosage'>Dosage: </label>
                    <input 
                        type='text' 
                        id='dosage' 
                        name='medicine' 
                        placeholder='Enter Dosage' 
                        value={dosage}
                        onChange={(e)=>{setDosage(e.target.value)}} 
                    />   
                </div>

                <div className='flex flex-col'>
                    <label htmlFor='duration'>Duration: </label>
                    <input 
                        type='text' 
                        id='duration' 
                        name='medicine' 
                        placeholder='Duration' 
                        value={duration}
                        onChange={(e)=>{setDuration(e.target.value)}} 
                    />   
                </div>
            </div>
            <button 
            type='submit'
            className="mt-5 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 
            border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
            >{isEditing ? "Edit" : "Add item to table" }</button>
        </form>

        {/* table items */}
        <table width="100%" className='mb-10 mt-10'>
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
                        <td className='text-s text-center'>{medicine}</td>
                        <td className='text-s text-center'>{dosage}</td>
                        <td className='text-s text-center'>{duration}</td>
                        <td>
                            <button 
                            onClick={()=>editRow(id)} 
                            className='text-green-500 font-bold'><AiOutlineEdit />
                            </button>
                        </td>
                        <td>
                            <button 
                            onClick={()=>deleteRow(id)} 
                            className='text-red-500 font-bold'><AiOutlineDelete />
                            </button>
                        </td>
                    </tr>
                </tbody>
                </React.Fragment>
            })} 

        </table>
    </>
  )
}

export default TableForm