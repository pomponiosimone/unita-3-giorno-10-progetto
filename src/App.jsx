import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Weather from './components/Weather';
import ForecastDetails from './components/ForecastDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/" element={<Weather />} />

          
          <Route path="/forecast/:city" element={<ForecastDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;