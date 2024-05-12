import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MainMap from './MainMap';


function App() {
  return (

    <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainMap />}></Route>
    </Routes>
  </BrowserRouter>

  );
}

export default App;