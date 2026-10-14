import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import { NotificationManager } from 'react-notifications';
import './index.css';
import getUser from "../../../services/api/user/getUser";
import { getAuthToken } from "../../../utils";
import { AuthToken } from "../../../types/auth";
import updateUser from "../../../services/api/user/updateUser";
import jwtDecode from "jwt-decode";
import { getAdminStatus, resetUserPassword } from "../../../services/api/user";

const EditProfilePage: React.FC = () => {
  const authToken = getAuthToken();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const forcePasswordChangeOnly =
    mustChangePassword ||
    new URLSearchParams(window.location.search).get("changePassword") === "1";

  const loadUser = (
    authToken: AuthToken
  ) => {
    return getUser({
      uuid: authToken.id,
      onInit: () => setLoading(true),
      onError: (errorMessage) => NotificationManager.error(errorMessage),
      onFinish: () => setLoading(false),
      onSuccess: (
        response
      ) => {
        setUsername(response.username);
        setEmail(response.email);
        setName(response.name);
      }
    })
  }

  const loadAccountStatus = async () => {
    let nextMustChangePassword = false;

    await getAdminStatus({
      onInit: () => setLoading(true),
      onError: (errorMessage) => {
        setMustChangePassword(false);
        NotificationManager.error(errorMessage);
      },
      onFinish: () => setLoading(false),
      onSuccess: (response) => {
        nextMustChangePassword = response.mustChangePassword;
        setMustChangePassword(response.mustChangePassword);
      },
    });

    return nextMustChangePassword;
  }

  // The page should initialize once per mount using the signed-in user context.
  useEffect(() => {
    const bootstrapPage = async () => {
      if (authToken === null) {
        return;
      }

      const accountMustChangePassword = await loadAccountStatus();

      if (accountMustChangePassword) {
        return;
      }

      await loadUser(authToken);
    }

    bootstrapPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (authToken === null) return <></>

  const passwordMismatch =
    passwordConfirmation.length > 0 && password !== passwordConfirmation;
  const passwordTooShort = password.length > 0 && password.length < 12;
  const passwordReady =
    password.length >= 12 &&
    passwordConfirmation.length > 0 &&
    !passwordMismatch;
  
  return (
    <main className="edit-profile-page">
      <h2 className="edit-profile-page__heading">
        { forcePasswordChangeOnly ? "Change Password" : "Edit Profile" }
      </h2>
      <LoadingSpinner show={loading} />
      {
        forcePasswordChangeOnly &&
        <p>
          Your temporary password must be replaced before the rest of the application can be used.
        </p>
      }
      {
        !forcePasswordChangeOnly &&
        <form 
          onSubmit={(e) => {
            e.preventDefault();

            return updateUser({
              uuid: authToken.id,
              username,
              name,
              email,
              onInit: () => setLoading(true),
              onError: async (errorMessage) => {
                await loadUser(authToken);
                NotificationManager.error(errorMessage);
              },
              onFinish: () => setLoading(false),
              onSuccess: async (response) => {
                await loadUser(
                  jwtDecode(
                    response.newToken
                  ) as AuthToken
                );
                NotificationManager.success("Profile updated successfully");

              }
            })
          }} 
          className="edit-profile-page__form"
        >
          <div className="edit-profile-page__form-group">
            <label htmlFor="username">
              Username:
            </label>
            &nbsp;
            <input
              type="text"
              required
              id="username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
          </div>
          <div className="edit-profile-page__form-group">
            <label htmlFor="email">
              Email:
            </label>
            &nbsp;
            <input
              type="email"
              required
              value={email}
              id="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div className="edit-profile-page__form-group">
            <label htmlFor="name">
              Name:
            </label>
            &nbsp;
            <input
              type="text"
              required
              value={name}
              id="name"
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </div>
          <div className="edit-profile-page__form-group">
            <input 
              type="submit"
              value="Submit"
              className="edit-profile-page__form-input"
            />
          </div>
        </form>
      }
      <div className="edit-profile-page__password-panel">
        <h3 className="edit-profile-page__subheading">Change Password</h3>
        <div className="edit-profile-page__password-fields">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
          />
        </div>
        {
          passwordTooShort &&
          <p>Password must be at least 12 characters.</p>
        }
        {
          passwordMismatch &&
          <p>Passwords do not match.</p>
        }
        <button
          type="button"
          className="edit-profile-page__form-input"
          disabled={!passwordReady || loading}
          onClick={async () => {
            await resetUserPassword({
              uuid: authToken.id,
              password,
              onInit: () => setLoading(true),
              onError: (errorMessage) => NotificationManager.error(errorMessage),
              onFinish: () => setLoading(false),
              onSuccess: async () => {
                setPassword("");
                setPasswordConfirmation("");
                await loadAccountStatus();
                NotificationManager.success("Password updated successfully");

                if (forcePasswordChangeOnly) {
                  window.location.href = "/termbases";
                }
              },
            });
          }}
        >
          Update Password
        </button>
      </div>
    </main>
  )
}

export default EditProfilePage;