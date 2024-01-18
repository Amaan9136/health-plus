import React, { useEffect, useState } from "react";
import Doctor from "../Assets/doctor-picture.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faAngleUp, faCommentDots, faTable, faHeartPulse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../Styles/Hero.css";
import Chatbot from './Chatbot/Chatbot'
import { useDispatch, useSelector } from "react-redux";
import { handleShowBot, handleViewModel } from "../Store/redux";
import ViewTable from "./ViewTable";
function Hero() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [goUp, setGoUp] = useState(false);
  const showBot = useSelector(state => state.chatBotSlice.showBot);
  const showViewModel = useSelector(state => state.modelSlice.showViewModel);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookAppointmentClick = () => {
    navigate("/appointment");
  };

  useEffect(() => {
    const onPageScroll = () => {
      if (window.scrollY > 600) {
        setGoUp(true);
      } else {
        setGoUp(false);
      }
    };
    window.addEventListener("scroll", onPageScroll);

    return () => {
      window.removeEventListener("scroll", onPageScroll);
    };
  }, []);

  return (
    <div className="section-container">
      {showBot && <Chatbot />}
      <div className="hero-section">
        <div className="text-section">
          <p className="text-headline">❤️ Health comes first</p>
          <h2 className="text-title">
            Find your Doctor and make an Appointments
          </h2>
          <p className="text-descritpion">
            Talk to online doctors and get medical advice, online prescriptions,
            refills and medical notes within minutes. On-demand healthcare
            services at your fingertips.
          </p>
          <button
            style={{ margin: '0.5rem 1rem 0.5rem 0rem' }}
            className="text-appointment-btn"
            type="button"
            onClick={()=>{navigate('/predict-disease')}}
          >
            <FontAwesomeIcon icon={faHeartPulse} /> Predict Disease
          </button>
          <button
            style={{ margin: '0.5rem 1rem 0.5rem 0rem' }}
            className="text-appointment-btn"
            type="button"
            onClick={handleBookAppointmentClick}
          >
            <FontAwesomeIcon icon={faCalendarCheck} /> Book Appointment
          </button>
          <button
            style={{ margin: '0.5rem 1rem 0.5rem 0rem' }}
            className="text-appointment-btn"
            type="button"
            onClick={() => dispatch(handleViewModel())}
          >
            {showViewModel ? 'Close Appointment Data' : <><FontAwesomeIcon icon={faTable} /> View My Appointments</>}
          </button>
          <button
            style={{ margin: '0.5rem 1rem 0.5rem 0rem' }}
            className="text-appointment-btn"
            type="button"
            onClick={() => dispatch(handleShowBot())}
          >
            <FontAwesomeIcon icon={faCommentDots} /> {showBot ? 'Close Chat' : 'Open Chat'}
          </button>

          {showViewModel && <ViewTable />}

          <div className="text-stats">
            <div className="text-stats-container">
              <p>145k+</p>
              <p>Receive Patients</p>
            </div>

            <div className="text-stats-container">
              <p>50+</p>
              <p>Expert Doctors</p>
            </div>

            <div className="text-stats-container">
              <p>10+</p>
              <p>Years of Experience</p>
            </div>
          </div>
        </div>

        <div className="hero-image-section">
          <img className="hero-image1" src={Doctor} alt="Doctor" />
        </div>
      </div>

      <div
        onClick={scrollToTop}
        className={`scroll-up ${goUp ? "show-scroll" : ""}`}
      >
        <FontAwesomeIcon icon={faAngleUp} />
      </div>
    </div>
  );
}

export default Hero;