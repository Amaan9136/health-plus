import React, { useRef, useState } from 'react';
import { recommendDiseases, readDiseaseTableCsv } from '../Components/Chatbot/data/botFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartPulse } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import "../Styles/PredictDisease.css";

export default function PredictDisease() {
  const [recommendedDiseases, setRecommendedDiseases] = useState([]);
  const [tableDataForDisease, setTableDataForDisease] = useState(null);
  const inputRef = useRef();

  const handleButtonClick = async (selectedDisease) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    inputRef.current.value = selectedDisease;
    const diseaseDetails = await readDiseaseTableCsv(selectedDisease);
    setTableDataForDisease(diseaseDetails);
  };

  return (
    <div className="appointment-form-section">
      <h1 className="legal-siteTitle">
        <Link to="/">
          Health <span className="legal-siteSign">+</span>
        </Link>
      </h1>

      <div className="form-container">
        <h2 className="form-title">
          <span>Predict Disease</span>
        </h2>
        <form className="form-content">
          <label>
            Enter Symptoms / Disease Name:
            <input
              type="text"
              ref={inputRef}
              onChange={async (e) => {
                const inputValue = e.target.value.trim().toLowerCase();
                recommendDiseases(inputValue).then((recommendedDiseases) => {
                  setRecommendedDiseases(recommendedDiseases);
                });
              }}
            />
          </label>
          <button
            type="button"
            style={{fontSize:'16px', padding:'12px 14px'}}
            className="text-appointment-btn"
            onClick={async () => {
              const inputValue = inputRef.current.value.trim().toLowerCase();
              const diseaseDetails = await readDiseaseTableCsv(inputValue);
              setTableDataForDisease(diseaseDetails);
            }}
          >
            <FontAwesomeIcon icon={faHeartPulse} /> Find Disease
          </button>
        </form>

        {tableDataForDisease && inputRef.current.value !== ''  && (
          <div className="table-div">
            <h2 style={{ marginBottom: '2.3rem' }} className="form-title">
              <span>Details found for {tableDataForDisease.name} :</span>
            </h2>
            <table className="disease-table">
              <tr><td><b>Disease:</b></td><td>{tableDataForDisease.name}</td></tr>
              <tr><td><b>Symptoms:</b></td><td>{tableDataForDisease.symptoms}</td></tr>
              <tr><td><b>Precautions:</b></td><td>{tableDataForDisease.precautions}</td></tr>
              <tr><td><b>Drugs:</b></td><td>{tableDataForDisease.drugs}</td></tr>
            </table>
          </div>
        )}

        {recommendedDiseases.disease && inputRef.current.value !== ''  ? (
          <div className="recommendations-container">
            <h2 style={{ marginBottom: '2.3rem' }} className="form-title">
              <span>Recommended Diseases:</span>
            </h2>
            <div className="form-content">
              {Array.from(new Set(recommendedDiseases.disease)).sort().map((disease, index) => (
                <button className="recommend-btn" key={index} onClick={() => handleButtonClick(disease)}>
                  {disease}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p>{recommendedDiseases.message}</p>
        )}

      </div>
    </div>
  );
}