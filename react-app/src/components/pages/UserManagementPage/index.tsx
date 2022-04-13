import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { getAllUsers } from "../../../services/api/user";
import { User } from "../../../types/auth";
import { mapRoleIdToName } from "../../../utils";
import LoadingSpinner from "../../LoadingSpinner";
import Table from "../../Table";
import UserModal from "../../modals/UserModal";
import "./index.css";

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

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
        />
      }
    </main>
  )
}

export default UserManagementPage;