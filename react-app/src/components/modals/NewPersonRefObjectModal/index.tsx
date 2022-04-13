import React, { useState } from "react";
import Modal from "../../Modal"
import "./index.css";
import { ModalProps } from "../types";
import { NotificationManager } from "react-notifications";
import postPersonRefObject from "../../../services/api/baseterm/postPersonRefObject";
import LoadingSpinner from "../../LoadingSpinner";
import { getAuthToken } from "../../../utils";
import { UUID } from "../../../types";

interface Props extends ModalProps<{
  termbaseUUID: UUID,
}> {
  isOpen: boolean,
  onClose: () => void,
  data: {
    termbaseUUID: UUID
  },
  onSubmit: () => void,
}

const NewPersonRefObjectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  onSubmit,
}) => {
  const authToken = getAuthToken();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  if (authToken === null) return <></>;

  return (
    <Modal 
      isOpen={isOpen} 
      header="New Reference"
      onClose={onClose}
    >
      <div className="new-person-ref-object-modal">
        <p>
          In order to associate TBX transactions to your BaseTerm account, you will need to enter some information in order to create a reference in the back matter. 
        </p>
        
        <LoadingSpinner show={loading} />
        <form 
          onSubmit={(e) => {
            e.preventDefault();

            return postPersonRefObject({
              name,
              email,
              role,
              id: authToken.id,
              termbaseUUID: data.termbaseUUID,
              onInit: () => setLoading(true),
              onError: (errorMessage) => NotificationManager.error(errorMessage),
              onFinish: () => setLoading(false),
              onSuccess: () => {
                onSubmit();
              }
            })
          }} 
          className="new-person-ref-object-modal__form"
        >
          <div className="new-person-ref-object-modal__form-group">
            <label htmlFor="name">
              Name
            </label>
            &nbsp;
            <input
              type="text"
              required
              id="name"
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </div>
          <div className="new-person-ref-object-modal__form-group">
            <label htmlFor="email">
              Email
            </label>
            &nbsp;
            <input
              type="email"
              required
              id="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div className="new-person-ref-object-modal__form-group">
            <label htmlFor="role">
              Role
            </label>
            &nbsp;
            <input
              type="text"
              required
              id="role"
              onChange={(event) => {
                setRole(event.target.value);
              }}
            />
          </div>
          <div className="new-person-ref-object-modal__form-group">
            <input 
              type="submit"
              value="Create"
              className="new-person-ref-object-modal__form-input"
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default NewPersonRefObjectModal;