import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { createManagedUser, getAdminStatus, getAllUsers, updateManagedUser } from "../../../services/api/user";
import { Role, User } from "../../../types/auth";
import { mapRoleIdToName } from "../../../utils";
import LoadingSpinner from "../../LoadingSpinner";
import Table from "../../Table";
import UserModal from "../../modals/UserModal";
import "./index.css";
import { AdminStatusEndpointResponse } from "../../../types/responses";
import PasswordField from "../../PasswordField";

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [adminStatus, setAdminStatus] = useState<AdminStatusEndpointResponse | undefined>(undefined);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [newRoleId, setNewRoleId] = useState<Role>(Role.User);

  const getUsers = () => {
    return getAllUsers({
      onInit: () => setLoading(true),
      onError: (errorMessage: string) =>  NotificationManager.error(errorMessage),
      onFinish: () => setLoading(false),
      onSuccess: (response) => {
        setUsers(response.users);
      }
    });
  }

  const loadAdminStatus = () => {
    return getAdminStatus({
      onError: (errorMessage: string) => NotificationManager.error(errorMessage),
      onSuccess: (response) => {
        setAdminStatus(response);
      },
    });
  }

  const handleVerificationToggle = async (user: User, verified: boolean) => {
    await updateManagedUser({
      uuid: user.user_id,
      verified,
      onInit: () => setLoading(true),
      onError: (errorMessage) => NotificationManager.error(errorMessage),
      onFinish: () => setLoading(false),
      onSuccess: async () => {
        NotificationManager.success(
          verified ? "User verified successfully" : "User moved back to pending approval",
        );
        await getUsers();
      },
    });
  };

  // Table data
  const tableHeaders = [
    'Name',
    'UUID',
    'Role',
    'Verified',
    'Password',
  ];

  const tableRows = users.map((user) => [
    <button
      type="button"
      className="user-management-page__name-button"
      onClick={() => {
        setSelectedUser(user)
      }}
    >
      <span className="user-management-page__name-label">{ user.name }</span>
      <span className="user-management-page__name-hint">Click to edit</span>
    </button>,
    user.user_id,
    mapRoleIdToName(user.role_id),
    <label className="user-management-page__toggle">
      <input
        type="checkbox"
        checked={user.verified}
        disabled={
          loading ||
          adminStatus?.mustChangePassword ||
          adminStatus?.userId === user.user_id
        }
        onChange={(event) => {
          handleVerificationToggle(user, event.target.checked);
        }}
      />
      <span className="user-management-page__toggle-slider" />
      <span className="user-management-page__toggle-label">
        {user.verified ? "Verified" : "Pending"}
      </span>
    </label>,
    user.must_change_password ? "Temporary" : "Normal",
  ]);

  useEffect(
    () => {
      getUsers();
      loadAdminStatus();
    },
    []
  );

  useEffect(() => {
    if (selectedUser !== undefined) {
      const updatedUser = users.find((user) => {
        return user.user_id === selectedUser.user_id
      }) as User | undefined

      setSelectedUser(
        updatedUser
      );
    }
  }, [selectedUser, users])

  return (
    <main className="user-management-page">
      <div className="container user-management-page__container">
        <LoadingSpinner show={loading} />
        {
          adminStatus?.mustChangePassword &&
          <p className="user-management-page__alert">
            The default administrator password is still active. Change your own password here before using the rest of the application.
          </p>
        }
        <section className="user-management-page__section">
          <h2>Create User</h2>
          <p>
            Admin-created users are verified immediately and must change their temporary password after the first login.
          </p>
          <form
            className="user-management-page__form"
            onSubmit={(event) => {
              event.preventDefault();

              if (newPassword !== newPasswordConfirmation) {
                NotificationManager.error("Passwords do not match");
                return;
              }

              createManagedUser({
                username: newUsername,
                email: newEmail,
                name: newName,
                password: newPassword,
                roleId: newRoleId,
                onInit: () => setLoading(true),
                onError: (errorMessage) => NotificationManager.error(errorMessage),
                onFinish: () => setLoading(false),
                onSuccess: async () => {
                  setNewUsername("");
                  setNewEmail("");
                  setNewName("");
                  setNewPassword("");
                  setNewPasswordConfirmation("");
                  setNewRoleId(Role.User);
                  NotificationManager.success("User created successfully");
                  await getUsers();
                },
              });
            }}
          >
            <div>
              <label className="user-management-page__label" htmlFor="new-user-username">Username</label>
              <input
                id="new-user-username"
                className="form-control"
                type="text"
                placeholder="Username"
                value={newUsername}
                onChange={(event) => setNewUsername(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="user-management-page__label" htmlFor="new-user-name">Name</label>
              <input
                id="new-user-name"
                className="form-control"
                type="text"
                placeholder="Name"
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="user-management-page__label" htmlFor="new-user-email">Email</label>
              <input
                id="new-user-email"
                className="form-control"
                type="email"
                placeholder="Email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="user-management-page__label" htmlFor="new-user-role">Role</label>
              <select
                id="new-user-role"
                className="form-control"
                value={newRoleId}
                onChange={(event) => setNewRoleId(Number(event.target.value) as Role)}
              >
                <option value={Role.Inactive}>Inactive</option>
                <option value={Role.User}>User</option>
                <option value={Role.Staff}>Staff</option>
                <option value={Role.Admin}>Admin</option>
              </select>
            </div>
            <div>
              <label className="user-management-page__label" htmlFor="new-user-password">Temporary password</label>
              <PasswordField
                id="new-user-password"
                className="form-control"
                placeholder="Temporary password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="user-management-page__label" htmlFor="new-user-password-confirmation">Confirm temporary password</label>
              <PasswordField
                id="new-user-password-confirmation"
                className="form-control"
                placeholder="Confirm temporary password"
                value={newPasswordConfirmation}
                onChange={(event) => setNewPasswordConfirmation(event.target.value)}
                required
              />
            </div>
            <div className="user-management-page__form-actions">
              <button className="btn btn-primary" type="submit">Create User</button>
            </div>
          </form>
        </section>
        <section className="user-management-page__section">
          <div className="user-management-page__table-header">
            <h2>User Management</h2>
            <p className="user-management-page__table-help">
              Click a user&apos;s name to edit their details.
            </p>
          </div>
          <Table 
            headers={tableHeaders}
            rows={tableRows}
          />
        </section>
        {
          selectedUser !== undefined &&
          <UserModal 
            isOpen={true}
            onClose={() => {
              setSelectedUser(undefined);
            }}
            onDelete={() => {
              setSelectedUser(undefined);
              getUsers();
            }}
            data={selectedUser}
            onUpdate={async () => {
              await getUsers();
            }}
            onPasswordReset={async (userId) => {
              await Promise.all([
                getUsers(),
                loadAdminStatus(),
              ]);

              if (
                adminStatus?.mustChangePassword &&
                adminStatus.userId === userId
              ) {
                window.location.href = "/termbases";
              }
            }}
            currentUserId={adminStatus?.userId || ""}
            mustChangeOwnPassword={adminStatus?.mustChangePassword || false}
          />
        }
      </div>
    </main>
  )
}

export default UserManagementPage;