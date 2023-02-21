import React, { useContext, useEffect, useState } from "react";
import Canvas from "./components/Canvas";
import SettingBar from "./components/SettingBar";
import Toolbar from "./components/Toolbar";
import "./styles/app.scss";
import {BrowserRouter, Route, Routes, Navigate,  useLocation, useNavigate } from "react-router-dom";
import { observer, useObserver } from "mobx-react-lite";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import { Context } from ".";
import { RequireAuth } from "./services/RequireAuth";
import Loader from "./components/Loader";


const App = () => {
  const {authState} = useContext(Context)

  useEffect(() => {
    if (localStorage.getItem('token')) {
        authState.checkAuth()
    }
}, [])

  if (authState.isLoading) {
    return (       
      <Loader/>
  )  }

  return (
    <BrowserRouter>
      <div className="app">
           <Routes> 
              <Route path='/draw/:id' element={<RequireAuth><Toolbar/><SettingBar/><Canvas/></RequireAuth>} />
              <Route path='/draw' element={<RequireAuth><Toolbar/><SettingBar/><Canvas/>
                <Navigate to={`/draw/f${(+new Date()).toString(16)}`} replace/></RequireAuth>}/> 
                <Route path="*" element={<Navigate to='/draw' replace />}/>
            <Route path='/login' element={<LoginForm/>} />
            <Route path='/registration' element={<RegistrationForm/>} />
          </Routes>
      </div>
    </BrowserRouter>

  );
}

export default observer(App);