import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Register from './components/Register';
import QuickAdvice from './components/QuickAdvice';
import KnowledgeBase from './components/KnowledgeBase';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import TraditionPage from './components/TraditionPage';
import './styles/global.css';

function App() {
  return (
    <Router>
        <div className="app">
            <Navbar />  {/* This ensures the header is always visible */}  
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/quick-advice" element={<QuickAdvice />} />
                <Route path="/knowledge-base" element={<KnowledgeBase />} />
                <Route path="/tradition/:type/:id" element={<TraditionPage />} />
                <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                    <Dashboard />
                    </PrivateRoute>
                }
                />
            </Routes>
        </div>    
    </Router>
  );
}

export default App;