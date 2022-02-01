import './App.css';
import * as React from 'react';
import {  Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Home.js'
import Make from './Make.js'
import Keys from './Keys.js'
import Error from './Error.js'

function App() {

  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/make" element={<Make />}></Route>
            <Route path="/keys" element={<Keys />}></Route>
            <Route path="*" element={<Error />}></Route>
          </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
