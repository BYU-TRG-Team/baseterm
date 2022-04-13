import React, { useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import './index.css';
import { initiatePasswordRecovery } from "../../../services/api/user";
import { NotificationManager } from "react-notifications";

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  return (
    <main className="reset-password-page">
      <h2 className="reset-password-page__heading">Reset Password</h2>
      <LoadingSpinner show={loading} />
      <form 
        onSubmit={(e) => {
          e.preventDefault();

          return initiatePasswordRecovery({
            email,
            onInit: () => setLoading(true),
            onError: (errorMessage) => NotificationManager.error(errorMessage),
            onFinish: () => setLoading(false)
          })
        }} 
        className="reset-password-page__form"
        >
          <div className="reset-password-page__form-group">
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
          <div className="reset-password-page__form-group">
            <input 
              type="submit"
              value="Submit"
              className="reset-password-page__form-input"
            />
          </div>
        </form>
      <br /> 
      <br />
    </main>
  )
}

export default ResetPasswordPage;