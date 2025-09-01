import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../App';

const Navbar = () => {
  const [token, setToken] = useContext(store);

  return (
    <div style={{ background: "#fc8144ff" }}>
      <nav className="navbar px-4">
        {/* FIX: Use Link instead of link */}
        <span className="navbar-brand mb-0 h1" style={{ color: '#fff' }}>
          <Link to="/home" style={{ textDecoration: "none", color: "#fff" }}>
            <strong>🍳Cook Mate</strong>
          </Link>
        </span>

        {!token ? (
          // If NOT logged in → show Register & Login
          <div className="d-flex">
            <Link
              to="/register"
              className="btn me-2"
              style={{ background: "#fff", color: "#fc8144ff" }}
            >
              <b>Register</b>
            </Link>
            <Link
              to="/login"
              className="btn"
              style={{ background: "#fff", color: "#fc8144ff" }}
            >
              <b>Login</b>
            </Link>
          </div>
        ) : (
          <div className="d-flex">
            
            <button
              className="btn"
              style={{ background: "#fff", color: "#fc8144ff" }}
              onClick={() => setToken(null)}
            >
              <b>Logout</b>
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
