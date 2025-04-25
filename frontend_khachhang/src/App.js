import React from 'react';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import HomePage from './pages/homePage/HomePage';
function App() {
  return (
    <div className="app-container">
      <Navbar />
      <HomePage />
      <div className="main-content">
        {/* Nội dung chính của trang */}
      </div>
    </div>
  );
}

export default App;