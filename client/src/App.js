import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SymptomChecker from './SymptomChecker'; // Import your symptom checker component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
        </Routes>
      </div>
    </Router>
  );
}

const HomePage = () => {
  return (
    <div style={styles.homePage}>
      <h1>Welcome to Breathwise</h1>
      <p>
        At Breathwise, we are dedicated to providing accurate
        information and tools to help you understand your respiratory health.
        Our mission is to empower individuals to take control of their health
        through education and innovative diagnostic solutions.
      </p>
      <p>
        Our symptom checker is designed to help you identify potential lung
        conditions based on your symptoms. Please click the button below to
        get started.
      </p>
      <Link to="/symptom-checker" style={styles.button}>
        Start Symptom Checker
      </Link>
    </div>
  );
};

const styles = {
  homePage: {
    textAlign: 'center',
    padding: '50px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
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
