import React from 'react';
import './App.css';
import {
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";

// components
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './components/pages/Homepage';
import ValidationPage from './components/pages/ValidationPage';
import ImportPage from './components/pages/ImportPage';
import CreatePage from './components/pages/CreatePage';
import TermbasesPage from './components/pages/TermbasesPage';
import TermbasePage from './components/pages/TermbasePage';
import NotFoundPage from './components/pages/NotFoundPage';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from "./components/pages/SignUpPage";
import EmailVerificationPage from './components/pages/EmailVerificationPage';
import RecoverySentPage from "./components/pages/RecoverySentPage";
import ResetPasswordSubmitPage from './components/pages/ResetPasswordSubmitPage';
import { NotificationContainer } from 'react-notifications';
import {
  unverifiedRedirect,
  nonAuthenticatedRedirect
} from "./redirects";

/* 
* Third party stylesheets
*
* Overrides are in App.css
*/
import 'react-notifications/lib/notifications.css';
import { getAuthToken } from './utils';
import { Role } from './types/auth';
import ResetPasswordPage from './components/pages/ResetPasswordPage';
import EditProfilePage from './components/pages/EditProfilePage';
import UserManagementPage from './components/pages/UserManagementPage';

const PrivateRoute: React.FC<{
  roles: Role[],
  children: JSX.Element
}> =({ roles, children }) => {
  const token = getAuthToken();

  if (token === null) {
    return nonAuthenticatedRedirect;
  }

  if (!token.verified) {
    return unverifiedRedirect;
  }

  if (roles.includes(token.role)) {
    return children;
  }

  return <NotFoundPage />
}

const App: React.FC = () => (
  <div className="app">
    <Header />
    <NotificationContainer />
    <div className="app__content">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={<Homepage />} 
          />
          <Route 
            path="/login"
            element={<LoginPage />}
          />
          <Route 
            path="/signup"
            element={<SignUpPage />}
          />
          <Route 
            path="/email-verification"
            element={<EmailVerificationPage />}
          />
          <Route 
            path="/recover"
            element={<ResetPasswordPage />}
          />
          <Route 
            path="/recover/sent"
            element={<RecoverySentPage />}
          />
          <Route 
            path="/recover/:token"
            element={<ResetPasswordSubmitPage />}
          />
          <Route 
            path="/edit-profile"
            element={
              <PrivateRoute
                roles={[
                  Role.Admin,
                  Role.Staff,
                  Role.User
                ]}
              >
                <EditProfilePage />
              </PrivateRoute>
            }
          />
          <Route 
            path="/user-management"
            element={
              <PrivateRoute
                roles={[
                  Role.Admin
                ]}
              >
                <UserManagementPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/create" 
            element={
              <PrivateRoute
                roles={[
                  Role.Admin,
                  Role.Staff
                ]}
              >
                <CreatePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/import" 
            element={
              <PrivateRoute
                roles={[
                  Role.Admin,
                  Role.Staff
                ]}
              >
                <ImportPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/validate" 
            element={<ValidationPage />} 
          />
          <Route 
            path="/termbases" 
            element={
              <PrivateRoute
                roles={[
                  Role.Admin,
                  Role.Staff,
                  Role.User,
                ]}
              >
                <TermbasesPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/termbase/:termbaseUUID" 
            element={<TermbasePage />} 
          />
          <Route 
            path="*" 
            element={<NotFoundPage />} 
          />
        </Routes> 
      </BrowserRouter>
    </div>
    <Footer />
  </div>
);

export default App;
