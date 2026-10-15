import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <NavLink to="/events" className="brand">🎟️ EventHub</NavLink>
        <nav className="nav-links">
          <NavLink to="/events">Events</NavLink>
          {user ? (
            <>
              <NavLink to="/my-events">My Events</NavLink>
              <span className="muted">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="btn">Sign up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}