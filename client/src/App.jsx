import React from "react";
import Canvas from "./components/Canvas";
import SettingBar from "./components/SettingBar";
import Toolbar from "./components/Toolbar";
import "./styles/app.scss";
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path='/:id' element={<><Toolbar/><SettingBar/><Canvas/></>} />
          <Route path='/' element={<><Toolbar/><SettingBar/><Canvas/>
            <Navigate to={`/f${(+new Date()).toString(16)}`} replace/></>} />
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;