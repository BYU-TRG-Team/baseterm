import React from 'react';
import { getAuthToken } from '../../utils';
import './index.css';
import { getAuthorizedLinks } from './links';
import ProfileDropdown from '../dropdowns/ProfileDropdown';

const authToken = getAuthToken();

const Header: React.FC = () => (
  <header className="header">
    <h1>
      <a 
        href="/" 
        className="header__link header__link--header"
      >
        BaseTerm
      </a>
    </h1>
    <div className="header__link-group">
      {
        authToken === null &&
        <>
          <a 
            href="/login" 
            className="header__link header__link--default"
          >
            Login
          </a>
          <a
            href="/signup"
            className="header__link header__link--default"
          >
            Sign Up
          </a>
        </>
      }
      {
        authToken !== null &&
        getAuthorizedLinks(authToken.role)
      }
      <a 
        className="header__link header__link--default" 
        href="/validate"
      >
        Validate
      </a>
      {
        authToken !== null &&
        <ProfileDropdown />
      }
    </div>
  </header>
);

export default Header;