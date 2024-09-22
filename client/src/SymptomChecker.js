import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import Meyda from 'meyda';


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
  
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
      const audioData = audioBuffer.getChannelData(0);  
      console.log('Audio Data Length:', audioData.length);
  
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
  
      const analyzer = Meyda.createMeydaAnalyzer({
        audioContext: audioContext,
        source: source,
        featureExtractors: ['mfcc'],
        bufferSize: 512,  
        hopSize: 256,   
        mfcc: {
          nCoefficients: 13, 
          minFrequency: 20,
          maxFrequency: audioBuffer.sampleRate / 2
        }
      });
  
      const mfccs = [];
  
      const collectMFCCs = () => {
        const features = analyzer.get('mfcc');
        if (features) {
          mfccs.push(features); 
        }
      };
  
      source.start();
      analyzer.start();
  
      const collectMFCCsContinuously = () => {
        collectMFCCs();
        requestAnimationFrame(collectMFCCsContinuously);
      };
  
      collectMFCCsContinuously();
  
      await new Promise((resolve) => {
        source.onended = resolve;
      });
  
      analyzer.stop();
  
      if (mfccs.length === 0) {
        throw new Error('No MFCCs were collected.');
      }
  
      console.log('Extracted MFCCs:', mfccs.length);
  
      const numFrames = mfccs.length;
      const numCoefficients = mfccs[0].length;
  
      console.log(`Collected: ${numFrames} frames, ${numCoefficients} coefficients per frame`);
  
      const expectedFrames = 157;
      const expectedCoefficients = 20;
  
      let paddedMfccs;
  
      if (numFrames > expectedFrames) {
        paddedMfccs = mfccs.slice(0, expectedFrames);
      } else {
        paddedMfccs = [...mfccs];
        while (paddedMfccs.length < expectedFrames) {
          paddedMfccs.push(new Array(numCoefficients).fill(0));
        }
      }
  
      paddedMfccs = paddedMfccs.map(frame => {
        if (frame.length > expectedCoefficients) {
          return frame.slice(0, expectedCoefficients);
        } else {
          const paddedFrame = [...frame];
          while (paddedFrame.length < expectedCoefficients) {
            paddedFrame.push(0);
          }
          return paddedFrame;
        }
      });
  
      const mfccTensor = tf.tensor(paddedMfccs).reshape([1, expectedCoefficients, expectedFrames, 1]);
  
      async function predictDisease(mfccTensor) {
        try {
          const predictions = await model.predict(mfccTensor);
          console.log('Prediction result:', predictions);
  
          const probabilities = predictions.dataSync();
          console.log('Probabilities:', probabilities);
  
          const predictedDisease = predictions.argMax(-1).dataSync()[0];
          console.log('Predicted Disease:', predictedDisease);
  
          setPrediction(predictedDisease);
        } catch (err) {
          console.error('Error during prediction:', err);
        }
      }
  
      await predictDisease(mfccTensor);
  
    } catch (error) {
      console.error('Error processing breath recording:', error);
    }
  };
  
  const diagnoseDiseases = () => {
    const symptomScores = [];
    const diseases = [
      {
        name: 'COPD',
        symptoms: {
          cough: 1,
          breath: 1,
          wheezing: 1,
          fatigue: 1,
          chestPain: 0,
          mucus: 0,
          fever: 0,
        },
        link: 'https://www.lung.org/lung-health-diseases/lung-disease-lookup/copd',
        diseaseDescrip: 'COPD is a progressive lung disease that makes it difficult to breathe. It includes conditions like emphysema and chronic bronchitis. People with COPD often experience persistent cough, shortness of breath, and mucus production. Smoking is the primary cause of COPD, and symptoms worsen over time.',
      },      
      {
        name: 'Healthy',
        symptoms: {
          cough: 0,
          fever: 0,
          breath: 0,
          fatigue: 0,
          chestPain: 0,
          mucus: 0,
          wheezing: 0,
        },
        link: '',
        diseaseDescrip: 'No significant disease detected.',
      },
      {
      name: 'URTI',
      symptoms: {
        cough: 1,
        fever: 1,
        mucus: 0,
        breath: 1,
        fatigue: 1,
        chestPain: 0,
        wheezing: 0,
      },
      link: 'https://www.ncbi.nlm.nih.gov/books/NBK532961/',
      diseaseDescrip: 'URTIs are infections that affect the upper part of the respiratory system, including the nose, throat, and sinuses. Common examples include the common cold, sinusitis, and laryngitis. Symptoms often include a sore throat, nasal congestion, runny nose, coughing, and sneezing. URTIs are usually caused by viruses and tend to resolve on their own.',
    },
    {
      name: 'Bronchiectasis',
      symptoms: {
        cough: 1,
        chestPain: 1,
        fever: 0,
        breath: 0,
        fatigue: 0,
        mucus: 0,
        wheezing: 0,
      },
      link: 'https://www.lung.org/lung-health-diseases/lung-disease-lookup/bronchiectasis',
      diseaseDescrip: 'Bronchiectasis is a chronic lung condition where the walls of the bronchi (large airways) are damaged, causing them to widen and become scarred. This leads to mucus build-up and recurring lung infections. Symptoms include a persistent cough, chest pain, and frequent lung infections.',
    },
      {
        name: 'Pneumonia',
        symptoms: {
          cough: 1,
          breath: 1,
          fever: 1,
          fatigue: 0,
          chestPain: 0,
          mucus: 0,
          wheezing: 0,
        },
        link: 'https://www.cdc.gov/pneumonia/index.html',
        diseaseDescrip: 'Pneumonia is a lung infection that inflames the air sacs (alveoli) in one or both lungs, which can fill with fluid or pus. Symptoms include cough with mucus, fever, chills, and difficulty breathing. Pneumonia can be caused by bacteria, viruses, or fungi, and it is often more severe in older adults or those with weakened immune systems.',
      },
      {
        name: 'Bronchiolitis',
        symptoms: {
          cough: 1,
          fatigue: 1,
          mucus: 1,
          wheezing: 0,
          breath: 0,
          chestPain: 0,
          fever: 0,
        },
        link: 'https://www.mayoclinic.org/diseases-conditions/bronchiolitis/symptoms-causes/syc-20351565',
        diseaseDescrip: 'Bronchiolitis is a common viral infection that primarily affects the small airways in the lungs, called bronchioles. It is most often seen in young children and infants, causing coughing, wheezing, and mucus production. Respiratory syncytial virus (RSV) is a common cause of bronchiolitis.',
      },
      {
        name: 'LRTI',
        symptoms: {
          cough: 1,
          fever: 1,
          mucus: 0,
          breath: 1,
          fatigue: 0,
          chestPain: 0,
          wheezing: 0,
        },
        link: 'https://www.templehealth.org/services/conditions/lower-respiratory-tract-infections#:~:text=Lower%20Respiratory%20Tract%20Infections%20(LRTI)%20are%20infections%20that%20affect%20the,characterized%20in%20many%20different%20ways.',
        diseaseDescrip: 'LRTIs include infections such as bronchitis or pneumonia that affect the lower airways and lungs. Symptoms typically include cough, difficulty breathing, fever, and mucus production. LRTIs are often caused by viruses but can also be bacterial.',
      }
    ];

    const symptomValues = Object.keys(generalSymptoms).reduce((acc, symptom) => {
      acc[symptom] = generalSymptoms[symptom] === 'yes' ? 1 : 0;
      return acc;
    }, {});

    const scoredDiseases = diseases.map((disease) => {
      let score = 0;
      Object.keys(disease.symptoms).forEach((symptom) => {
        score += disease.symptoms[symptom] === symptomValues[symptom] ? 1 : 0;
      });
      symptomScores.push(score);
      return { ...disease, score };
    });

    const sortedDiseases = scoredDiseases.sort((a, b) => b.score - a.score).slice(0, 2);

    setDiagnosis(sortedDiseases.length > 0 ? sortedDiseases : [{ name: 'No significant disease detected' }]);
  };

  return (
    <div className="SymptomChecker" style={styles.homePage}>
      <h1> Symptom Checker</h1>
      <h2>General Symptom Check</h2>
      <form>
        <label>Cough:</label>
        <br />
        <input type="radio" name="cough" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="cough" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />
        <br />

        <label>Fever:</label>
        <br />
        <input type="radio" name="fever" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="fever" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />
        <br />

        <label>Difficulty Breathing:</label>
        <br />
        <input type="radio" name="breath" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="breath" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />
        <br />

        <label>Fatigue:</label>
        <br />
        <input type="radio" name="fatigue" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="fatigue" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />
        <br />

        <label>Chest Pain:</label>
        <br />
        <input type="radio" name="chestPain" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="chestPain" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />
        <br />

        <label>Mucus/Phlegm Production:</label>
        <br />
        <input type="radio" name="mucus" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="mucus" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />
        <br />

        <label>Wheezing:</label>
        <br />
        <input type="radio" name="wheezing" value="yes" onChange={handleGeneralSymptomsChange} /> Yes
        <input type="radio" name="wheezing" value="no" onChange={handleGeneralSymptomsChange} /> No
        <br />
        <br />


        <label>Upload Audio for Analysis:</label>
        <br />
        <input type="file" accept="audio/*" onChange={handleAudioUpload} />
        {audioPreview && <audio controls src={audioPreview}></audio>}
        <br />

        <button 
          type="button" 
          onClick={diagnoseDiseases} 
          style={{
            color: 'darkblue',    
            border: '2px solid darkblue',  
            borderRadius: '10px',
            padding: '10px',
            marginTop: '10px',
            backgroundColor: 'transparent',
            cursor: 'pointer' 
          }}>
          Diagnose
        </button>
        <br></br>
        <Link to="/" style={styles.button}>Back to Home</Link>
      </form>
      
function getTopTwoDiagnoses(probabilities, symptomScores) {
  const diseaseIndexMap = {
    COPD: 0,
    Healthy: 1,
    URTI: 2,
    Bronchiectasis: 3,
    Pneumonia: 4,
    Bronchiolitis: 5,
    LRTI: 6,
  };

  const diseaseScores = Object.entries(diseaseIndexMap).map(([name, index]) => ({
    name,
    probability: probabilities[index],
    score: symptomScores[index],
  }));

  diseaseScores.sort((a, b) => {
    if (b.probability === a.probability) {
      return b.score - a.score;
    }
    return b.probability - a.probability;
  }

  return diseaseScores.slice(0, 2);}


const topDiagnoses = getTopTwoDiagnoses(probabilities, symptomScores);

{topDiagnoses.length > 0 && (
  <div>
    <h3>Top Two Possible Diagnoses:</h3>
    <ul>
      {topDiagnoses.map((disease, index) => (
        <li key={index}>
          {disease.name}: {disease.diseaseDescrip}
          <br />
          {disease.link && (
            <a href={disease.link} target="_blank" rel="noopener noreferrer">
              Learn more about {disease.name}
            </a>
          )}
          <br />
          Score: {disease.score}/7
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
    marginTop: '3rem',
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
