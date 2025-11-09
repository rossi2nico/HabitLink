import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import habitlink from '../assets/habitlink.png'
import batman from '../assets/batman.png';
export const Navigation = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div className="navigation">
      <div className="nav-left">
        <img className = "icon" src = { habitlink }></img>
        <h3 className = "habitlink"> HabitLink </h3>
      </div>
      <div className="nav-mid">
        <h3><Link to="/habits">Habits</Link></h3>
        <h3><Link to="/metrics">Metrics</Link></h3>
        <h3><Link to="/friends">Friends</Link></h3>
      </div>
      <div className="nav-right">
        {!user ? (
          <>
            <h3 className="login-nav"><Link to="/login">Login</Link></h3>
            <h3 className="register-nav"><Link to="/signup">Register</Link></h3>
          </>
        ) : (
          <>
            <img className = "profile-picture" src = { batman } ></img>
            <h3 className="nav-user">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</h3>
            <button className="logout" onClick={logout}>Log out</button>
          </>
        )}
      </div>
    </div>
  );
}
