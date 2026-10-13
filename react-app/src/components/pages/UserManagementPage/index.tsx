import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { getAdminStatus, getAllUsers } from "../../../services/api/user";
import { User } from "../../../types/auth";
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
    mapRoleIdToName(
      user.role_id
    )
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
      const updatedUser = users.filter((user) => {
        return user.user_id === selectedUser.user_id
      })[0] as User | undefined

      setSelectedUser(
        updatedUser
      );
    }
  }, [users])

  return (
    <main className="user-management-page">   
      <LoadingSpinner show={loading} />
      {
        adminStatus?.mustChangePassword &&
        <p>
          The default administrator password is still active. Change your own password here before using the rest of the application.
        </p>
      }
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