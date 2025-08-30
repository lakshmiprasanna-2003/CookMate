import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Register from './Components/Register';
import Login from './Components/Login';
import MyProfile from './Components/MyProfile';
import Navbar from './Components/Navbar';

export const store = createContext();

const App = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 add loading state

  // Load token from localStorage on app start
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
    // simulate small wait (e.g. 1s)
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  if (loading) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</h2>;
  }

  return (
    <store.Provider value={[token, setToken]}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myprofile" element={<MyProfile />} />
        </Routes>
      </BrowserRouter>
    </store.Provider>
  );
};

export default App;
