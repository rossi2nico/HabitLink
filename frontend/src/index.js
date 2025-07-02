import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext'
import { HabitsContextProvider } from './context/HabitsContext';
import { FriendsContextProvider } from './context/FriendsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
      <FriendsContextProvider>
        <HabitsContextProvider>
          <App/>
        </HabitsContextProvider>
      </FriendsContextProvider>  
    </AuthContextProvider>
);


