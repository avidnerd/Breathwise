import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';

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
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [prediction, setPrediction] = useState(''); 

    

  const handleGeneralSymptomsChange = (e) => {
    setGeneralSymptoms({
      ...generalSymptoms,
      [e.target.name]: e.target.value,
    });
  };
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);

      const fileUrl = URL.createObjectURL(file);
      setAudioPreview(fileUrl);
    }
  };

  class JSONIOHandler {
    constructor(json) {
      this.json = json;
    }
  
    async save(handlerOrURL, config) {
      throw new Error('Saving not implemented');
    }
  
    async load(handlerOrURL, loadOptions) {
      return this.json;
    }
  }
  

  
  const processBreathRecording = async () => {
    if (!audioFile) {
      alert('Please upload a breath recording.');
      return;
    }
    async function loadLayersModelFromJSON(json) {
      const ioHandler = new JSONIOHandler(json);
      return tf.loadLayersModel(ioHandler);
    }
    
    try {
      const modelJson = await fetch('/models/tfjs_target_dir/model1.json').then(response => response.json());

      const model = await loadLayersModelFromJSON(modelJson);
      
      const arrayBuffer = await audioFile.arrayBuffer();

      const audioData = new Uint8Array(arrayBuffer); 
      const tensorData = tf.tensor(audioData); 

      const predictions = await model.predict(tensorData);

      const predictedDisease = predictions.argMax(-1).dataSync()[0];
      setPrediction(predictedDisease);
      console.log('Predicted Disease:', predictedDisease); 

    } catch (error) {
      console.error('Error processing breath recording:', error);
    }
  };
  
  const diagnoseDiseases = () => {
    const diseases = [];

    if (generalSymptoms.cough === 'yes' && generalSymptoms.breath === 'yes' && generalSymptoms.wheezing === 'yes') {
      if (generalSymptoms.fatigue === 'yes') {
        diseases.push({ name: 'COPD', link: 'https://www.lung.org/lung-health-diseases/lung-disease-lookup/copd', recommendation: 'Please consult a healthcare professional.', diseaseDescrip: 'Chronic Obstructive Pulmonary Disease (COPD) is a progressive lung condition characterized by persistent airflow limitation, primarily caused by long-term exposure to harmful substances, such as cigarette smoke, air pollution, or occupational dust. It encompasses two main conditions: chronic bronchitis, which involves inflammation and narrowing of the airways, and emphysema, which involves damage to the alveoli (air sacs) in the lungs. Individuals who are susceptible to COPD typically include smokers, those exposed to secondhand smoke, and people with a history of occupational exposure to dust and chemicals. Additionally, genetic factors, such as alpha-1 antitrypsin deficiency, can increase the risk. Symptoms often include chronic cough, sputum production, and shortness of breath, which can significantly impact quality of life and lead to serious complications.' });
      } else {
        diseases.push({ name: 'Asthma', link: 'https://www.lung.org/lung-health-diseases/lung-disease-lookup/asthma', recommendation: 'Keep an inhaler handy and consult a doctor if symptoms persist.', diseaseDescrip: 'Asthma is a chronic respiratory condition where the airways become inflamed and narrow, leading to difficulty breathing. It is often triggered by allergens, exercise, cold air, or irritants such as smoke and pollution. Asthma causes recurring episodes of wheezing, coughing, chest tightness, and shortness of breath, which can vary in severity. People of all ages can develop asthma, but it often begins in childhood. Those with a family history of asthma, allergies, or eczema, or who are exposed to environmental triggers, are more susceptible. While asthma cannot be cured, it can be managed with medications like inhalers and by avoiding triggers, allowing most people to live active, healthy lives.'  });
      }
    }
    if (generalSymptoms.fever === 'yes' && generalSymptoms.breath === 'yes') {
      diseases.push({ name: 'Pneumonia', link: 'https://www.cdc.gov/pneumonia/index.html', recommendation: 'See a doctor right away.', diseaseDescrip: 'Pneumonia is an infection that inflames the air sacs (alveoli) in one or both lungs, causing them to fill with fluid or pus, leading to symptoms such as cough with phlegm, fever, chills, and difficulty breathing. It can be caused by bacteria, viruses, fungi, or even inhaled irritants. The severity of pneumonia can range from mild to life-threatening, especially in vulnerable groups such as infants, the elderly, and individuals with weakened immune systems or chronic conditions like COPD or heart disease. Smokers and those recently hospitalized are also at higher risk. Treatment often involves antibiotics (for bacterial pneumonia), antiviral medications, rest, fluids, and sometimes hospitalization for severe cases.'});
    }
    if (generalSymptoms.cough === 'yes' && generalSymptoms.fatigue === 'yes' && generalSymptoms.mucus === 'yes') {
      diseases.push({ name: 'Bronchitis', link: 'https://www.cdc.gov/bronchitis/index.html', recommendation: 'Keep an eye on your symptoms and consult a doctor if they worsen.', diseaseDescrip:'Bronchitis is the inflammation of the bronchial tubes, the airways that carry air to the lungs, leading to symptoms such as a persistent cough, mucus production, shortness of breath, and chest discomfort. It can be acute, usually caused by viral infections (like the common cold) and lasting a few weeks, or chronic, often due to long-term irritants such as cigarette smoke or air pollution. Chronic bronchitis is a form of Chronic Obstructive Pulmonary Disease (COPD) and is characterized by recurring episodes of cough and mucus production for at least three months in two consecutive years. Smokers, people exposed to pollutants, and those with weakened immune systems are more susceptible to bronchitis. Treatment typically focuses on symptom relief, with rest, fluids, and medications like inhalers or antibiotics (if bacterial infection is present).' });
    }
    if (generalSymptoms.cough === 'yes' && generalSymptoms.fever === 'no' && generalSymptoms.breath === 'no') {
      if (generalSymptoms.chestPain === 'yes') {
        diseases.push({ name: 'Bronchiectasis', link: 'https://www.lung.org/lung-health-diseases/lung-disease-lookup/bronchiectasis', recommendation: 'Monitor your symptoms.', diseaseDescrip:'Bronchiectasis is a chronic condition where the walls of the bronchi (the airways) become permanently widened and damaged, leading to an abnormal buildup of mucus. This can cause recurrent lung infections, persistent cough, excessive sputum production, and shortness of breath. Bronchiectasis can result from repeated lung infections, underlying conditions like cystic fibrosis, or immune system disorders that impair the ability to clear mucus. People who have had severe respiratory infections, tuberculosis, or are immunocompromised are more susceptible to bronchiectasis. Treatment focuses on clearing mucus from the lungs through physiotherapy, medications like antibiotics to control infections, and sometimes inhalers to improve breathing.' });
      }
    }
    if (generalSymptoms.cough === 'yes' && generalSymptoms.fever === 'yes' && generalSymptoms.mucus === 'no') {
      diseases.push({ name: 'LRTI', link: 'https://www.cdc.gov/healthywater/hygiene/healthy_homes/lower-respiratory-tract-infections.html', recommendation: 'Consult a healthcare professional for evaluation.', diseaseDescrip:'Lower Respiratory Tract Infections (LRTIs) are infections that affect the airways below the voice box, including the trachea, bronchi, bronchioles, and lungs. Common LRTIs include bronchitis, pneumonia, and bronchiolitis. Symptoms often include coughing, mucus production, chest pain, difficulty breathing, and fever. LRTIs can be caused by viruses (such as influenza or respiratory syncytial virus), bacteria (like *Streptococcus pneumoniae*), or fungi, and can range from mild to severe. Infants, the elderly, smokers, and individuals with chronic conditions or weakened immune systems are at higher risk. Treatment depends on the cause but may include antiviral or antibiotic medications, rest, and supportive care like fluids and oxygen therapy in severe cases.' });
    }
    if (generalSymptoms.breath === 'no' && generalSymptoms.fatigue === 'no') {
      diseases.push({ name: 'Healthy', link: '', recommendation: 'You likely do not have any serious disease.' });
    }

    if (prediction) {
      diseases.push({
        name: `Predicted Disease: ${prediction}`,
        recommendation: 'Consult a doctor for further analysis based on breath recording.',
        diseaseDescrip: 'This disease was predicted based on the analysis of your breath recording.',
      });
    }

    setDiagnosis(diseases.length > 0 ? diseases.slice(0, 3) : [{ name: 'No significant disease detected', recommendation: 'Consult a healthcare professional if symptoms persist.' }]);
  };

  return (
    <div className="SymptomChecker" style={styles.homePage}>
        <br></br>
        <br></br>
        <br/>
      <h2>General Symptom Check</h2>
      <label>Upload Breath Recording:</label>
          <br/>
          <input type="file" accept="audio/*" onChange={handleAudioUpload} />
          {audioPreview && (
            <div style={styles.audioPreview}>
              <audio controls>
                <source src={audioPreview} type={audioFile?.type || "audio/wav"} />
                Your browser does not support the audio element.
              </audio>
            </div>
        )}
          <br></br>
          <br/>
        <button type="button" onClick={processBreathRecording}>
          Analyze Breath Recording
        </button>
        <br/>
        {prediction && (
            <div>
                <h3>Predicted Disease from Breath Recording:</h3>
                <p>{prediction}</p>
            </div>
        )}
      <form>
        <label>Cough:</label>
        <br/>
        <input type="radio" name="cough" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="cough" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />
        <br/>

        <label>Fever:</label>
        <br/>
        <input type="radio" name="fever" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="fever" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />
        <br/>

        <label>Difficulty Breathing:</label>
        <br/>
        <input type="radio" name="breath" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="breath" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />
        <br/>

        <label>Fatigue:</label>
        <br/>
        <input type="radio" name="fatigue" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="fatigue" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />
        <br/>

        <label>Chest Pain:</label>
        <br/>
        <input type="radio" name="chestPain" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="chestPain" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />
        <br/>

        <label>Mucus/Phlegm Production:</label>
        <br/>
        <input type="radio" name="mucus" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="mucus" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />
        <br/>

        <label>Wheezing:</label>
        <br/>
        <input type="radio" name="wheezing" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="wheezing" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />
        <br />
        
        <button
          
  type="button"
  onClick={diagnoseDiseases}
>
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
                <br />
                <strong>Disease Description:</strong> {disease.diseaseDescrip}
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
    fontWeight: '600',
    ':hover':{
      backgroundColor: '#0056b3',
    },
  },

};

export default SymptomChecker;
