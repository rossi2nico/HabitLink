import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

export const Navigation = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div className="navigation">
  <div className="nav-left">
    <h3 className = "habitlink"> HabitLink </h3>
  </div>
  <div className = "nav-mid">
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
        <h3 className = "nav-user">{user.username}</h3>
        <button className = "logout" onClick = { logout }>logout</button>
      </>
    )}
  </div>
</div>


  );
}
