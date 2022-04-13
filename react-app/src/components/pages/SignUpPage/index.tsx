import React, { useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import { NotificationManager } from 'react-notifications';
import './index.css';
import { signUp } from "../../../services/api/user";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  return (
    <main className="signup-page">
      <h2 className="signup-page__heading">Sign Up</h2>
      <LoadingSpinner show={loading} />
      <form 
        onSubmit={(e) => {
          e.preventDefault();

          return signUp({
            username,
            password,
            name,
            email,
            onInit: () => setLoading(true),
            onError: (errorMessage) => NotificationManager.error(errorMessage),
            onFinish: () => setLoading(false),
            onSuccess: () => {
              window.location.href = "/email-verification";
            }
          })
        }} 
        className="signup-page__form"
      >
        <div className="signup-page__form-group">
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
        <div className="signup-page__form-group">
          <label htmlFor="name">
            Name:
          </label>
          &nbsp;
          <input
            type="text"
            required
            id="name"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </div>
        <div className="signup-page__form-group">
          <label htmlFor="email">
            Email:
          </label>
          &nbsp;
          <input
            type="email"
            required
            id="email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </div>
        <div className="signup-page__form-group">
          <label htmlFor="password">
            Password:
          </label>
          &nbsp;
          <input
            type="password"
            required
            id="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <div className="signup-page__form-group">
          <input 
            type="submit"
            value="Submit"
            className="signup-page__form-input"
          />
        </div>
      </form>
    </main>
  )
}

export default LoginPage;