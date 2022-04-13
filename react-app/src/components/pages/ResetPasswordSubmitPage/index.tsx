import React, { useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import './index.css';
import { NotificationManager } from "react-notifications";
import { submitPasswordRecovery } from "../../../services/api/user";
import { useParams } from "react-router-dom";

const ResetPasswordSubmitPage: React.FC = () => {
  const token = useParams().token as string;
  const [password, setPassword] = useState<string>("");
  const [repeatedPassword, setRepeatedPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  return (
    <main className="reset-password-submit-page">
      <h2 className="reset-password-submit-page__heading">Reset Password</h2>
      <LoadingSpinner show={loading} />
      <form 
        onSubmit={(e) => {
          e.preventDefault();

          if (password !== repeatedPassword) {
            return NotificationManager.error(
              "Passwords do not match"
            );
          }

          return submitPasswordRecovery({
            password,
            token,
            onInit: () => setLoading(true),
            onError: (errorMessage) => NotificationManager.error(errorMessage),
            onSuccess: () => {
              window.location.href = "/termbases";
            },
            onFinish: () => setLoading(false)
          })
        }} 
        className="reset-password-submit-page__form"
        >
          <div className="reset-password-submit-page__form-group">
            <label htmlFor="password">
              New Password:
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
          <div className="reset-password-submit-page__form-group">
            <label htmlFor="repeatedPassword">
              Repeat New Password:
            </label>
            &nbsp;
            <input
              type="password"
              required
              id="repeatedPassword"
              onChange={(event) => {
                setRepeatedPassword(event.target.value);
              }}
            />
          </div>
          <div className="reset-password-submit-page__form-group">
            <input 
              type="submit"
              value="Submit"
              className="reset-password-submit-page__form-input"
            />
          </div>
        </form>
      <br /> 
      <br />
    </main>
  )
}

export default ResetPasswordSubmitPage;