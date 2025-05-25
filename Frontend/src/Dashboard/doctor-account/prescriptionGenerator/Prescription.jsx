import { useState, useRef } from "react";
import Footer from './Footer'
import Notes from "./Notes";
import Signature from "./Signature";
import Table from "./Table";
import Dates from "./Dates";
import ClientDetails from "./ClientDetails";
import DoctorDetails from "./DoctorDetails";
import Header from "./Header";
import TableForm from "./TableForm";
import ReactToPrint from 'react-to-print'


function App() {
  const [showPrescription, setShowPrescription] = useState(false)
  const [doctorName, setDoctorName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAdd, setHospitalAdd] = useState('');
  const [hospitalContact, setHospitalContact] = useState('')
  const [patientName, setPatientName] = useState('');
  const [patientSex, setPatientSex] = useState('');
  const [patientAge, setPatientAge] = useState(0);
  const [patientAdd, setPatientAdd] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [notes, setNotes] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [medicine, setMedicine] = useState('')
  const [dosage, setDosage] = useState('')
  const [duration, setDuration] = useState('')
  const [list, setList] = useState([])
  
  const componentRef = useRef()

  const handlerPrint = ()=>{
    window.print()
  }
  return (
    <>
      <main className="m-5 p-5 md:max-w-xl md:mx-auto lg:max-w-2xl lg:mx-auto bg-white rounded shadow">
        {showPrescription ? 
        <>
        <ReactToPrint 
          trigger={()=><button 
            className="bg-blue-500 ml-5 text-white font-bold py-2 px-6 rounded shadow border-2 
          border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300">
            Print / Download
            </button>}
          content={()=>componentRef.current}
        />
          <div ref={componentRef} className="p-5">
          <Header handlePrint={handlerPrint}/>
          <DoctorDetails doctorName={doctorName} hospitalName={hospitalName} hospitalAdd={hospitalAdd} hospitalContact={hospitalContact}/>
          <ClientDetails patientName={patientName} patientAdd={patientAdd} patientAge={patientAge} patientSex={patientSex} />
          <Dates currentDate={currentDate}/>
          <Table list={list} setList={setList}/>
          <Notes notes={notes} followUp={followUp}/>
          <Signature />
          <Footer />
        </div>

        <button 
            onClick={()=>setShowPrescription(false)}
            className="mt-5 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 
            border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300">
              Edit Information
        </button>
        </> : (
          <>
          {/* Doctors Name, Hospital Name, Hospital address, Patient Name, Patient sex, Patient age, 
          Patient address , Date, Table, Notes, Follow up Date, Signature  */}
            <div className="flex flex-col justify-center">
      
              <label htmlFor="DoctorName">Enter Doctor's name: </label>
                <input 
                  type="text" 
                  name="text" 
                  id="DoctorName" 
                  placeholder="Enter your name" 
                  autoComplete="false" 
                  value={doctorName}
                  onChange={(e)=>setDoctorName(e.target.value)}
                />
              
              <div className="grid lg:grid-cols-3 gap-5 md:grid-cols-2">
                  

                  <div>
                    <label htmlFor="HospitalName">Enter Hospital name</label>
                    <input 
                      type="text" 
                      name="text" 
                      id="HospitalName" 
                      placeholder="Enter Hospital's name" 
                      autoComplete="false" 
                      value={hospitalName}
                      onChange={(e)=>setHospitalName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="HospitalAdd">Enter Hospital's Address</label>
                    <input 
                      type="text" 
                      name="text" 
                      id="HospitalAdd" 
                      placeholder="Enter Hospitals Address" 
                      autoComplete="false" 
                      value={hospitalAdd}
                      onChange={(e)=>setHospitalAdd(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="HospitalContact">Hospital's Contact Number</label>
                    <input 
                      type="text" 
                      name="text" 
                      id="HospitalContact" 
                      placeholder="Enter Contact no." 
                      autoComplete="false" 
                      value={hospitalContact}
                      onChange={(e)=>setHospitalContact(e.target.value)}
                    />
                  </div>
              </div>

              

              <label htmlFor="PatientName" className="mt-20">Enter Patient's Name</label>
              <input 
                type="text" 
                name="text" 
                id="PatientName" 
                placeholder="Enter Patient name" 
                autoComplete="false" 
                value={patientName}
                onChange={(e)=>setPatientName(e.target.value)}
              />

              <div className="grid lg:grid-cols-3 gap-5 md:grid-cols-2 sm:grid-cols-1">
                <div>
                  <label htmlFor="PatientSex">Enter Patient's sex: </label>
                  <input 
                    type="text" 
                    name="text" 
                    id="PatientSex" 
                    placeholder="Enter Patient sex" 
                    autoComplete="false" 
                    value={patientSex}
                    onChange={(e)=>setPatientSex(e.target.value)}
                  />
                 </div>

                <div>
                  <label htmlFor="PatientAge">Enter Patient's Age: </label>
                  <input 
                    type="number" 
                    name="text" 
                    id="PatientAge" 
                    placeholder="Enter Patient Age" 
                    autoComplete="false" 
                    value={patientAge}
                    onChange={(e)=>setPatientAge(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="PatientAdd">Enter Patient's Address: </label>
                  <input 
                    type="text" 
                    name="text" 
                    id="PatientAdd" 
                    placeholder="Enter Patient Address" 
                    autoComplete="false" 
                    value={patientAdd}
                    onChange={(e)=>setPatientAdd(e.target.value)}
                  />
                </div>
              </div>

              <label htmlFor="CurrDate">Enter Today's Date: </label>
              <input 
                type="date" 
                name="text" 
                id="CurrDate" 
                placeholder="Enter Today's Date" 
                autoComplete="false" 
                value={currentDate}
                onChange={(e)=>setCurrentDate(e.target.value)}
              />

            {/* table */}
              <article>
                <TableForm 
                medicine={medicine} setMedicine={setMedicine}
                dosage={dosage} setDosage={setDosage}
                duration={duration} setDuration={setDuration}
                list={list} setList={setList}
                />
              </article>
            {/* table end */}
            <label htmlFor="Note" className="mt-10">Additional Notes: </label>
              <textarea 
                type="text" 
                name="text" 
                id="Note" 
                cols={30}
                rows={10}
                placeholder="Enter Note:" 
                autoComplete="false" 
                value={notes}
                onChange={(e)=>setNotes(e.target.value)}
              />

              <label htmlFor="FollowUp">Enter FollowUp Date: </label>
              <input 
                type="date" 
                name="text" 
                id="FollowUp" 
                placeholder="Enter FollowUp Date: " 
                autoComplete="false" 
                value={followUp}
                onChange={(e)=>setFollowUp(e.target.value)}
              />

              
              <button 
              onClick={()=>setShowPrescription(true)}
              className="mt-10 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 
              border-blue-500 hover:bg-transparent hover:text-blue-500 teansition-all duration-300">
                Preview Prescription
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default App;
