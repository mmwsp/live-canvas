import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthState from './store/authState';

export const authState = new AuthState()

export const Context = createContext({
    authState,
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{ authState }}>
        <App />
    </Context.Provider>

); 
