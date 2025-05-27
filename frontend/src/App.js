import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import Friends from './pages/Friends';
import Habits from './pages/Habits';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {

  const { user } = useAuthContext();
  return (
    <BrowserRouter>
      
      <div className="pages">
            <Routes>
            <Route
                path="/"
                element={user ? <Habits /> : <Navigate to ="/login" />}
              />
              <Route
                path="/habits"
                // element={user ? <Habits /> : <Navigate to ="/login" />}
                element= <Habits/>
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to ="/habits"/>}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to ="/habits" />}
              />
              <Route
                path="/friends"
                // element={user ? <Friends /> : <Navigate to ="/login" />}
                element = <Friends/>
              />
             </Routes>
          </div>
    </BrowserRouter>
  );
}

export default App;
