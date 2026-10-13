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
import resetUserPassword from "../../../services/api/user/resetUserPassword";

interface Props extends ModalProps<User> {
  isOpen: boolean,
  onClose: () => void,
  data: User,
  onDelete: () => void,
  onUpdate: () => Promise<void>,
  onPasswordReset: (userId: string) => Promise<void>,
  currentUserId: string,
  mustChangeOwnPassword: boolean,
}

const UserModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  onDelete,
  onUpdate,
  onPasswordReset,
  currentUserId,
  mustChangeOwnPassword,
}) => {

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const isOwnAccount = data.user_id === currentUserId;
  const passwordResetBlocked = mustChangeOwnPassword && !isOwnAccount;
  const passwordMismatch =
    passwordConfirmation.length > 0 && password !== passwordConfirmation;
  const passwordTooShort = password.length > 0 && password.length < 12;
  const passwordReady =
    password.length >= 12 &&
    passwordConfirmation.length > 0 &&
    !passwordMismatch &&
    !passwordResetBlocked;

  return (
    <Modal
      isOpen={isOpen}
      header={data.name}
      onClose={onClose}
    >
      <div>
        <LoadingSpinner show={loading} />
        {
          !mustChangeOwnPassword &&
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
        }
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
        {
          mustChangeOwnPassword &&
          <p>
            Change the seeded administrator password before editing roles or deleting users.
          </p>
        }
        {
          !mustChangeOwnPassword &&
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
        }
        <hr className="user-modal__hr" />
        <div>
          <strong>Password</strong>
          <p>
            {passwordResetBlocked
              ? "You must change your own administrator password before modifying anyone else."
              : `Set a new password for ${isOwnAccount ? "this account" : data.username}.`}
          </p>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          {
            passwordTooShort &&
            <p>Password must be at least 12 characters.</p>
          }
          {
            passwordMismatch &&
            <p>Passwords do not match.</p>
          }
          <button
            disabled={!passwordReady || loading}
            onClick={async () => {
              await resetUserPassword({
                uuid: data.user_id,
                password,
                onInit: () => setLoading(true),
                onError: (errorMessage) => NotificationManager.error(errorMessage),
                onFinish: () => setLoading(false),
                onSuccess: async () => {
                  setPassword("");
                  setPasswordConfirmation("");
                  NotificationManager.success("Password updated successfully");
                  await onPasswordReset(data.user_id);
                },
              });
            }}
          >
            Update Password
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default UserModal;