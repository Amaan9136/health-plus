import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../Styles/ViewTable.css';
import { handleViewModel } from '../Store/redux';
import { useDispatch } from 'react-redux';

export default function ViewTable() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [responseData, setResponseData] = useState(null);
  const dispatch = useDispatch();

  const handleCreateTable = async () => {
    try {
      const errors = {};
      if (!mobileNumber.trim()) {
        errors.mobileNumber = 'Patient phone number is required';
      } else if (mobileNumber.trim().length !== 10) {
        errors.mobileNumber = 'Patient phone number must be of 10 digits';
      }

      if (Object.keys(errors).length > 0) {
        toast.error(errors.mobileNumber, {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }

      const response = await fetch(`http://localhost/backend/getAppointment.php?mobileNumber=${mobileNumber}`);
      // START XAMPP OR ANY LOCALHOST SERVER'S (KEEP RUNNING THEM IN BACKEND)

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success(data.message, {
            position: toast.POSITION.TOP_CENTER,
          });
          setResponseData(data);
          // Handle the data as needed
        } else {
          toast.error(data.message, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } else {
        toast.error('Failed to fetch data', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      toast.error('Error finding data due to Network Issue!', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleClose = () => {
    dispatch(handleViewModel())
    setResponseData(null);
    setMobileNumber('');
  };

  return (
    <>
      {!responseData ? (
        <div className="view-box">
          <h2 className="form-title">
            <span>View Appointments & Bills</span>
          </h2>
          <label className="view-label">
            Mobile Number:
            <input
              type="number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="view-input"
              minLength={10}
            />
          </label>
          <br />
          <div className='button-container'>
            <button type="button" onClick={handleClose} className="close-button">
              Close
            </button>
            <button type="button" onClick={handleCreateTable} className="view-button">
              Show
            </button>
          </div>
        </div>
      ) : (
        <div className='table-div'>
          <h2 className="form-title">
            <span>Patient's Appointments & Bills</span>
          </h2>
          <table className='data-table'>
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Patient Name</th>
                <th>Patient Number</th>
                <th>Appointment Date</th>
                <th>Appointment Time</th>
                <th>Preferred Mode</th>
              </tr>
            </thead>
            <tbody>
              {responseData.appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{`${new Date(appointment.appointment_time).toLocaleDateString().replace(/\//g, '')}${appointment.id}`}</td>
                  <td>{appointment.patient_name}</td>
                  <td>{appointment.patient_number}</td>
                  <td>{new Date(appointment.appointment_time).toLocaleDateString()}</td>
                  <td>{new Date(appointment.appointment_time).toLocaleTimeString()}</td>
                  <td>{appointment.preferred_mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
      )}
    </>
  );
}