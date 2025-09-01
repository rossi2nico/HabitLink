import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Friends from './pages/Friends';
import Habits from './pages/Habits';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AdvancedHabit } from './components/AdvancedHabit';
import { CreateHabit } from './components/CreateHabit';
import { Home } from './pages/Habits';

function App() {
  const { user, loading } = useAuthContext();

  if (loading) return (
    <div style={{height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:"center"}}>
      <h1>Loading user ...</h1>
    </div>
  )

  return (
    <BrowserRouter>
      <div className="pages">
        <Routes>
          <Route
            path="/"
            element={user ? <Habits /> : <Navigate to="/login" replace />}
          />
          {/* <Route
          path = "secret"
          element = {<Home></Home>}
          /> */}
          <Route
            path="/habits"
            element={user ? <Habits /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/habits/:habitId"
            element={user ? <AdvancedHabit /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/habits/create"
            element={user ? <CreateHabit /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/habits" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/habits" replace />}
          />
          <Route
            path="/friends"
            element={user ? <Friends /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
