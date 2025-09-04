import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import Home from './Home';
import Menu from './Menu';
import Test from './Test';
import Freemode from './Freemode';
import Main from './Main';
import Casual from './Casual';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/main' element={<Main/>} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/casual" element={<Casual />} />
        <Route path="/freemode" element={<Freemode />} />
        <Route path='/dev' element={<Test />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
