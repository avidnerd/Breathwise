import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My React App</h1>
      </header>

      <main className="App-main">
        <p>This is a basic UI built with React. Below is a simple counter example:</p>
        <div className="counter">
          <button onClick={() => setCount(count - 1)}>-</button>
          <span>{count}</span>
          <button onClick={() => setCount(count + 1)}>+</button>
        </div>

        <section className="App-info">
          <h2>Features</h2>
          <ul>
            <li>Interactive Counter</li>
            <li>Responsive Design</li>
            <li>Styled with CSS</li>
          </ul>
        </section>
      </main>

      <footer className="App-footer">
        <p>React App © 2024</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More About React
        </a>
      </footer>
    </div>
  );
}

export default App;
