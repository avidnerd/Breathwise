import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SymptomChecker = () => {
  const [generalSymptoms, setGeneralSymptoms] = useState({
    cough: '',
    fever: '',
    breath: '',
    fatigue: '',
    chestPain: '',
    mucus: '',
    wheezing: '',
  });
  const [diagnosis, setDiagnosis] = useState([]);

  const handleGeneralSymptomsChange = (e) => {
    setGeneralSymptoms({
      ...generalSymptoms,
      [e.target.name]: e.target.value,
    });
  };

  const diagnoseDiseases = () => {
    const diseases = [];

    if (generalSymptoms.cough === 'yes' && generalSymptoms.breath === 'yes' && generalSymptoms.wheezing === 'yes') {
      if (generalSymptoms.fatigue === 'yes') {
        diseases.push({ name: 'COPD', link: 'https://www.lung.org/lung-health-diseases/lung-disease-lookup/copd', recommendation: 'Please consult a healthcare professional.' });
      } else {
        diseases.push({ name: 'Asthma', link: 'https://www.lung.org/lung-health-diseases/lung-disease-lookup/asthma', recommendation: 'Keep an inhaler handy and consult a doctor if symptoms persist.' });
      }
    }
    if (generalSymptoms.fever === 'yes' && generalSymptoms.breath === 'yes') {
      diseases.push({ name: 'Pneumonia', link: 'https://www.cdc.gov/pneumonia/index.html', recommendation: 'See a doctor right away.' });
    }
    if (generalSymptoms.cough === 'yes' && generalSymptoms.fatigue === 'yes' && generalSymptoms.mucus === 'yes') {
      diseases.push({ name: 'Bronchitis', link: 'https://www.cdc.gov/bronchitis/index.html', recommendation: 'Keep an eye on your symptoms and consult a doctor if they worsen.' });
    }
    if (generalSymptoms.cough === 'yes' && generalSymptoms.fever === 'no' && generalSymptoms.breath === 'no') {
      if (generalSymptoms.chestPain === 'yes') {
        diseases.push({ name: 'Bronchiectasis', link: 'https://www.lung.org/lung-health-diseases/lung-disease-lookup/bronchiectasis', recommendation: 'Monitor your symptoms.' });
      }
    }
    if (generalSymptoms.cough === 'yes' && generalSymptoms.fever === 'yes' && generalSymptoms.mucus === 'no') {
      diseases.push({ name: 'LRTI', link: 'https://www.cdc.gov/healthywater/hygiene/healthy_homes/lower-respiratory-tract-infections.html', recommendation: 'Consult a healthcare professional for evaluation.' });
    }
    if (generalSymptoms.breath === 'no' && generalSymptoms.fatigue === 'no') {
      diseases.push({ name: 'Healthy', link: '', recommendation: 'You likely do not have any serious disease.' });
    }

    setDiagnosis(diseases.length > 0 ? diseases.slice(0, 3) : [{ name: 'No significant disease detected', recommendation: 'Consult a healthcare professional if symptoms persist.' }]);
  };

  return (
    <div className="SymptomChecker" style={styles.homePage}>
      <h2>General Symptom Check</h2>
      <form>
        <label>Cough:</label>
        <input type="radio" name="cough" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="cough" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />

        <label>Fever:</label>
        <input type="radio" name="fever" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="fever" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />

        <label>Difficulty Breathing:</label>
        <input type="radio" name="breath" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="breath" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />

        <label>Fatigue:</label>
        <input type="radio" name="fatigue" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="fatigue" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />

        <label>Chest Pain:</label>
        <input type="radio" name="chestPain" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="chestPain" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />

        <label>Mucus/Phlegm Production:</label>
        <input type="radio" name="mucus" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="mucus" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />

        <label>Wheezing:</label>
        <input type="radio" name="wheezing" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="wheezing" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />

        <br />
        <button type="button" onClick={diagnoseDiseases}>
          Diagnose
        </button>
        <br />

        <Link to="/" style={styles.button}>Back to Home</Link>
      </form>

      {diagnosis.length > 0 && (
        <div>
          <h3>Possible Diagnoses:</h3>
          <ul>
            {diagnosis.map((disease, index) => (
              <li key={index}>
                {disease.name} - {disease.link && <a href={disease.link} target="_blank" rel="noopener noreferrer">More Info</a>}
                <br />
                <strong>Recommendation:</strong> {disease.recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  homePage: {
    padding: '3rem',
    backgroundColor: '#f4f4f4',
    borderRadius: '0.625rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  button: {
    display: 'inline-block',
    marginTop: '1.25rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007BFF',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontWeight: '600', //mayb not idk
    ':hover':{
      backgroundColor: '#0056b3',
    },
  },

};

export default SymptomChecker;
