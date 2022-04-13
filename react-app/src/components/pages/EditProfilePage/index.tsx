import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import { NotificationManager } from 'react-notifications';
import './index.css';
import getUser from "../../../services/api/user/getUser";
import { getAuthToken } from "../../../utils";
import { AuthToken } from "../../../types/auth";
import updateUser from "../../../services/api/user/updateUser";
import jwtDecode from "jwt-decode";

const EditProfilePage: React.FC = () => {
  const authToken = getAuthToken();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (authToken !== null) {
      loadUser(authToken)
    }
  }, [])

  if (authToken === null) return <></>
  
  return (
    <main className="edit-profile-page">
      <h2 className="edit-profile-page__heading">Edit Profile</h2>
      <LoadingSpinner show={loading} />
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
    </main>
  )
}

export default EditProfilePage;