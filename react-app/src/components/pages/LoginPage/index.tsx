import React, { useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import { NotificationManager } from 'react-notifications';
import './index.css';
import { getAdminStatus, signIn } from "../../../services/api/user";
import PasswordField from "../../PasswordField";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  return (
    <main className="login-page">
      <h2 className="login-page__heading">Log In</h2>
      <LoadingSpinner show={loading} />
      <form 
        onSubmit={(e) => {
          e.preventDefault();

          return signIn({
            username,
            password,
            onInit: () => setLoading(true),
            onError: (errorMessage) => NotificationManager.error(errorMessage),
            onFinish: () => setLoading(false),
            onSuccess: async () => {
              await getAdminStatus({
                onError: () => {
                  window.location.href = "/termbases";
                },
                onSuccess: (response) => {
                  window.location.href = response.mustChangePassword
                    ? "/edit-profile?changePassword=1"
                    : "/termbases";
                },
              });
            }
          })
        }} 
        className="login-page__form"
      >
        <div className="login-page__form-group">
          <label htmlFor="username">
            Username:
          </label>
          &nbsp;
          <input
            type="text"
            required
            id="username"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </div>
        <div className="login-page__form-group">
          <label htmlFor="password">
            Password:
          </label>
          &nbsp;
          <PasswordField
            required
            id="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <div className="login-page__form-group">
          <input 
            type="submit"
            value="Submit"
            className="login-page__form-input"
          />
        </div>
      </form>
    </main>
  )
}

export default LoginPage;