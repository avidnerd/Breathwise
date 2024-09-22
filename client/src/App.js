import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SymptomChecker from './SymptomChecker'; 
import logo from './logo2.png';
import lungs from './lungs.png';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
        </Routes>
      </div>
    </Router>
  );
}

const Header = () => {
  return (
    <div style={styles.header}>
      <img src={logo} alt="Logo" style={{ ...styles.logo, height: '40px' }} />
    </div>
  );
};

const HomePage = () => {
  return (
    <div style={styles.homePage}>
      <h1>Welcome to Breathwise</h1>
      <img src={lungs} alt="Lungs" style={{width: '130px', height: '130px'}} />
      <p>
        At Breathwise, we are dedicated to providing accurate
        information and tools to help you understand your respiratory health.
        Our mission is to empower individuals to take control of their health
        through education and innovative diagnostic solutions. Our goal is to reduce congestion 
        in hospitals by limiting the number of unneccessary visits,
        also relieving the financial burden on people who might struggle to afford healthcare.
        By limiting the number of unneccessary doctor visits, healthcare professionals can focus on patients who need it most.
      </p>
      <p>
        Our disease diagnosis system is designed to help you identify potential lung
        conditions based on your symptoms. Please click the button below to
        get started.
      </p>
      <Link to="/symptom-checker" style={styles.button}>
        Start Symptom Checker
      </Link>
      <br></br>
      <br/>
      <br/>
      <div style={{backgroundColor:'#e8e8e8', padding:10}}>
      <h1>How our Product Works</h1>
      <p>
        Our product uses a machine learning model to predict the likelihood of a user having a respiratory disease based on audio 
        recordings of their breathing. We combine the prediction from the model with the user's self-reported symptoms to provide a
        more accurate diagnosis. Our model has been trained on a large dataset of audio recordings and corresponding diagnoses, and has
        a validation accuracy of 92%.
        <br></br>
        <br></br>
        <div style={{color: '#2789b0'}}>
        <strong>
        Diseases our model has been trained to predict include
        Asthma, Chronic Obstructive Pulmonary Disease (COPD), Pneumonia, Bronchitis, Bronchiectasis, Lower Respiratory Tract Infections (LRTI), and Upper Respiratory Tract Infections (URTI)
        </strong>
        </div>
        
      </p>
      </div>
    </div>
  );
};

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: '#E4EEFF',
    padding: '20px 20px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1000,
  },
  logo: {
    height: '40px',
  },
  homePage: {
    textAlign: 'center',
    padding: '50px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginTop: '80px', 
  },
  button: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
};

export default App;
