import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

export const Navigation = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div className = "navigation">
      <h3><Link to="/">habitLink 2027 → gross profit $3mil</Link></h3>
      <h3><Link to="/habits">Habits</Link></h3>
      <h3><Link to="/friends">Friends</Link></h3>
      <h3><Link to="/login">Login</Link></h3>
      {user && 
        <>
        Signed in as { user.username }
        <button onClick = { logout }>Logout</button>
        </>
      }
    
    </div>
  );
}
