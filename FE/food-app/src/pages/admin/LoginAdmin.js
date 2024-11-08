// src/pages/admin/LoginAdmin.js
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginAdmin.css';

// Import FontAwesomeIcon and specific icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

function LoginAdmin() {
  return (
    <div className="uf-form-signin">
      <div className="text-center">
        <h1 className="text-white h3">Account Login</h1>
      </div>
      <form className="mt-4">
        <div className="input-group uf-input-group input-group-lg mb-3">
          <span className="input-group-text">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <input type="text" className="form-control" placeholder="Username or Email address" />
        </div>
        <div className="input-group uf-input-group input-group-lg mb-3">
          <span className="input-group-text">
            <FontAwesomeIcon icon={faLock} />
          </span>
          <input type="password" className="form-control" placeholder="Password" />
        </div>
        <div className="d-flex mb-3 justify-content-between">
          <Link to="/forgot-password" className="text-white">Forgot password?</Link>
        </div>
        <div className="d-grid mb-4">
          <button type="submit" className="btn uf-btn-primary btn-lg">Login</button>
        </div>
        <div className="d-flex mb-3">
        </div>
      </form>
    </div>
  );
}

export default LoginAdmin;
