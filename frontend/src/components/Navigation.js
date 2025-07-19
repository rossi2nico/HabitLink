import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import checkmark from '../assets/checkmark-red.png';

export const Navigation = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div className="navigation">
  <div className="nav-left">
    <img
      src = { checkmark }
      style={{ height: '18px', width: '18px', objectFit: 'contain', marginRight: '10px' }}
    />
    <h3><Link to="/habits">Habits</Link></h3>
    <h3><Link to="/friends">Friends</Link></h3>
  </div>

  <div className="nav-right">
    {!user ? (
      <>
        <h3><Link to="/login">Login</Link></h3>
        <h3><Link to ="/signup">Register</Link></h3>
      </>
    ) : (
      <>
        <span>Logged in as <strong>{user.username}</strong></span>
        <button onClick = { logout }>Sign Out</button>
      </>
    )}
  </div>
</div>


  );
}
