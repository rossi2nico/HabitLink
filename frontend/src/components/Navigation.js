import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

export const Navigation = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div className="navigation">
  <div className="nav-left">
    <img
      src="https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-black-and-white/1/12/Pokemans_004.gif"
      alt="Charmander"
      style={{ height: '74px', width: '74px', objectFit: 'contain', marginRight: '6px' }}
    />
    {/* <span><Link to="/">habitLink 2027 → gross profit $3mil</Link></span> */}
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
        <span>Signed in as <strong>{user.username}</strong></span>
        <button onClick={logout}>Logout</button>
      </>
    )}
  </div>
</div>


  );
}
