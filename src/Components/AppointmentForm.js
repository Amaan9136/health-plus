import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/AppointmentForm.css";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { handleViewModel } from "../Store/redux";
import ViewTable from "./ViewTable";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AppointmentForm() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const dispatch = useDispatch();
  const showViewModel = useSelector(state => state.modelSlice.showViewModel);
  const [patientName, setPatientName] = useState("");
  const [patientNumber, setPatientNumber] = useState("");
  const [patientGender, setPatientGender] = useState("default");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [preferredMode, setPreferredMode] = useState("default");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Validate form inputs
    const errors = {};
    if (!patientName.trim()) {
      errors.patientName = "Patient name is required";
    } else if (patientName.trim().length < 8) {
      errors.patientName = "Patient name must be at least 8 characters";
    }

    if (!patientNumber.trim()) {
      errors.patientNumber = "Patient phone number is required";
    } else if (patientNumber.trim().length !== 10) {
      errors.patientNumber = "Patient phone number must be of 10 digits";
    }

    if (patientGender === "default") {
      errors.patientGender = "Please select patient gender";
    }
    if (!appointmentTime) {
      errors.appointmentTime = "Appointment time is required";
    } else {
      const selectedTime = new Date(appointmentTime).getTime();
      const currentTime = new Date().getTime();
      if (selectedTime <= currentTime) {
        errors.appointmentTime = "Please select a future appointment time";
      }
    }
    if (preferredMode === "default") {
      errors.preferredMode = "Please select preferred mode";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const formData = {
        patientName,
        patientNumber,
        patientGender,
        appointmentTime,
        preferredMode,
      };

      // START XAMPP OR ANY LOCALHOST SERVER'S (KEEP RUNNING THEM IN BACKEND)
      const response = await fetch('http://localhost/backend/storeAppointment.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (response.ok && responseData.success) {
        toast.success(responseData.message, {
          position: toast.POSITION.TOP_CENTER,
        });

        setPatientName("");
        setPatientNumber("");
        setPatientGender("default");
        setAppointmentTime("");
        setPreferredMode("default");
        setFormErrors({});
      } else {
        toast.error("Error saving appointment data!", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      toast.error("Error saving data due to Network Issue!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <div className="appointment-form-section">
      <h1 className="legal-siteTitle">
        <Link to="/">
          Health <span className="legal-siteSign">+</span>
        </Link>
      </h1>

      <div className="form-container">
        {showViewModel && <ViewTable />}

        <h2 className="form-title">
          <span>Book Appointment Online</span>
        </h2>

        <form className="form-content" onSubmit={handleSubmit}>
          <label>
            Patient Full Name:
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
            {formErrors.patientName && <p className="error-message">{formErrors.patientName}</p>}
          </label>

          <br />
          <label>
            Patient Phone Number:
            <input
              type="text"
              value={patientNumber}
              onChange={(e) => setPatientNumber(e.target.value)}
              required
            />
            {formErrors.patientNumber && <p className="error-message">{formErrors.patientNumber}</p>}
          </label>

          {
          // USING AI - DISEASE PATENT FACING SO THAT IT CAN BE DETECTED AND RECOMMEND MEDICINE 
          /* <br />
          <label>
            Select Disease:
            <select
              value={patientDisease}
              onChange={(e) => setPatientDisease(e.target.value)}
              required
            >
              <option value="default">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="private">I will inform Doctor only</option>
            </select>
            {formErrors.patientDisease && <p className="error-message">{formErrors.patientDisease}</p>}
          </label> */}

          <br />
          <label>
            Patient Gender:
            <select
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value)}
              required
            >
              <option value="default">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="private">I will inform Doctor only</option>
            </select>
            {formErrors.patientGender && <p className="error-message">{formErrors.patientGender}</p>}
          </label>

          <br />
          <label>
            Preferred Appointment Time:
            <input
              type="datetime-local"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
            />
            {formErrors.appointmentTime && <p className="error-message">{formErrors.appointmentTime}</p>}
          </label>

          <br />
          <label>
            Preferred Mode:
            <select
              value={preferredMode}
              onChange={(e) => setPreferredMode(e.target.value)}
              required
            >
              <option value="default">Select</option>
              <option value="Voice Call">Voice Call</option>
              <option value="Video Call">Video Call</option>
            </select>
            {formErrors.preferredMode && <p className="error-message">{formErrors.preferredMode}</p>}
          </label>

          <br />
          <button style={{ marginBottom: '1rem', marginRight: '1rem' }} type="submit" className="text-appointment-btn">
            Save Appointment
          </button>
          <button
            type="button"
            onClick={() => { dispatch(handleViewModel()) }}
            className="text-appointment-btn">
            {showViewModel ? 'Close Appointment Data' : <><FontAwesomeIcon icon={faTable} /> View My Appointments</>}
          </button>

          <p className="success-message" style={{ display: isSubmitted ? "block" : "none" }}>Appointment details has been sent to the patients phone number via SMS.</p>
        </form>
      </div>

      <ToastContainer autoClose={2500} limit={1} closeButton={false} />
    </div>
  );
}

export default AppointmentForm;
