import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext'
import { HabitsContextProvider } from './context/HabitsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HabitsContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </HabitsContextProvider>
  </React.StrictMode>
);


