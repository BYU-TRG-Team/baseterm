import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { createManagedUser, getAdminStatus, getAllUsers } from "../../../services/api/user";
import { Role, User } from "../../../types/auth";
import { mapRoleIdToName } from "../../../utils";
import LoadingSpinner from "../../LoadingSpinner";
import Table from "../../Table";
import UserModal from "../../modals/UserModal";
import "./index.css";
import { AdminStatusEndpointResponse } from "../../../types/responses";

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

  // Table data
  const tableHeaders = [
    'Name',
    'UUID',
    'Role',
    'Status',
    'Password',
  ];

  const tableRows = users.map((user) => [
    <span
      className="user-management-page__actionable-text"
      onClick={() => {
        setSelectedUser(user)
      }}
    >
      { user.name }
    </span>,
    user.user_id,
    mapRoleIdToName(user.role_id),
    user.verified ? "Verified" : "Pending approval",
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
      <LoadingSpinner show={loading} />
      {
        adminStatus?.mustChangePassword &&
        <p>
          The default administrator password is still active. Change your own password here before using the rest of the application.
        </p>
      }
      <h2>Create User</h2>
      <p>
        Admin-created users are verified immediately and must change their temporary password after the first login.
      </p>
      <form
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
          <input
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={(event) => setNewUsername(event.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <select
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
          <input
            type="password"
            placeholder="Temporary password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm temporary password"
            value={newPasswordConfirmation}
            onChange={(event) => setNewPasswordConfirmation(event.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Create User</button>
        </div>
      </form>
      <Table 
        headers={tableHeaders}
        rows={tableRows}
      />
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
    </main>
  )
}

export default UserManagementPage;