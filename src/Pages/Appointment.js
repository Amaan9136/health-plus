import React from "react";
import AppointmentForm from "../Components/AppointmentForm";
import Reviews from "../Components/Reviews";
import Doctors from "../Components/Doctors";
import Footer from "../Components/Footer";

function Appointment() {
  return (
    <>
      <AppointmentForm />
      <Reviews />
      <Doctors />
      <Footer />
    </>
  );
}

export default Appointment;