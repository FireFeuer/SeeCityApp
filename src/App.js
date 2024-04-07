import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import MainMap from './MainMap';
import RegisterForm from './RegisterForm';

function App() {
  return (

    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginForm />}></Route>
      <Route path="/" element={<MainMap />}></Route>
      <Route path="/register" element={<RegisterForm/>}></Route>
    </Routes>
  </BrowserRouter>

  );
}

export default App;