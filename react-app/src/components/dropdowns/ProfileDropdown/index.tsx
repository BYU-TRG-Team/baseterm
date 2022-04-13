import React from "react";
import ProfileIcon from "./ProfileIcon";
import "./index.css";
import { getAuthToken } from "../../../utils";
import { logout } from "../../../services/api/user";
import { NotificationManager } from "react-notifications";

const authToken = getAuthToken();

const ProfileDropdown: React.FC = () => {
  if (authToken === null) return <></>;

  return (
    <div className="profile-dropdown">
      <div className="profile-dropdown__profile">
        <ProfileIcon 
          width="40"
          className="profile-dropdown__profile-icon"
        />
        <span>
          { authToken.username }</span>
      </div>
      <div className="profile-dropdown__content">
        <a 
          href="/edit-profile"
          className="profile-dropdown__link"
        >
          Edit Profile
        </a>
        <a 
          href="/logout" 
          className="profile-dropdown__link"
          onClick={(e) => {
            e.preventDefault();

            logout({
              onError: (errorMessage) => NotificationManager.error(errorMessage),
              onSuccess: () => {
                window.location.href = "/";
              }
            })
          }}
        >
          Logout
        </a>
      </div>
    </div>
  )
}

export default ProfileDropdown;