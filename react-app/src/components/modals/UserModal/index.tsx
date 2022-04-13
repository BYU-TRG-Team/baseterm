import React, { useState } from "react";
import Modal from "../../Modal"
import EditableField from "../../EditableField";
import "./index.css";
import DeleteWidget from "../../widgets/DeleteWidget";
import { ModalProps } from "../types";
import LoadingSpinner from "../../LoadingSpinner";
import { NotificationManager } from "react-notifications";
import { User } from "../../../types/auth";
import deleteUser from "../../../services/api/user/deleteUser";
import RoleDropdown from "../../dropdowns/RoleDropdown";
import updateUser from "../../../services/api/user/updateUser";

interface Props extends ModalProps<User> {
  isOpen: boolean,
  onClose: () => void,
  data: User,
  onDelete: () => void,
  onUpdate: () => Promise<void>,
}

const UserModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  onDelete,
  onUpdate,
}) => {

  const [loading, setLoading] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      header={data.name}
      onClose={onClose}
    >
      <div>
        <LoadingSpinner show={loading} />
        <div className="user-modal__button-wrapper">
          <DeleteWidget
            handleDelete={async () => {
              await deleteUser({
                uuid: data.user_id,
                onInit: () => setLoading(true),
                onSuccess: () => {
                  onDelete();
                  onClose();
                },
                onError: (errorMessage) => NotificationManager.error(errorMessage),
                onFinish: () => setLoading(false)
              });
            }}
            resourceName="User"
          />
        </div>
        <hr className="user-modal__hr" />
        <EditableField
          value={data.name}
          enableEditing={false}
          label="Name"
        />
        <EditableField
          value={data.username}
          enableEditing={false}
          label="Username"
        />
        <EditableField
          value={data.email}
          enableEditing={false}
          label="Email"
        />
        <RoleDropdown 
          onChange={(roleId) => {
            return updateUser({
              uuid: data.user_id,
              roleId,
              onInit: () => setLoading(true),
              onError: async (errorMessage) => NotificationManager.error(errorMessage),
              onFinish: () => setLoading(false),
              onSuccess: () => {
                onUpdate();
              }
            })
          }}
          selectedRole={data.role_id}
        />
      </div>
    </Modal>
  )
}

export default UserModal;