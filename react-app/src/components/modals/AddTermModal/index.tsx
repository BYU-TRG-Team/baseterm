import React, { useState } from "react";
import Modal from "../../Modal"
import './index.css';
import { ModalProps } from "../types";
import { UUID } from "../../../types";
import LoadingSpinner from "../../LoadingSpinner";
import { postTerm } from "../../../services/api/baseterm";
import { NotificationManager } from "react-notifications";

interface Props extends ModalProps<{
  termbaseUUID: UUID,
  langSecUUID: UUID,
}> {
  onClose: () => void,
  isOpen: boolean,
  onSuccess: () => Promise<void>,
}

const AddTermModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  data,
}) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const reset = () => {
    setValue("");
  }
 
  return (
    <Modal 
      isOpen={isOpen} 
      header="New Term"
      onClose={onClose}
    >
      <div className="add-term-modal__content">
        <LoadingSpinner show={loading} />
        <form 
          onSubmit={async (e) => {
            e.preventDefault()
            try {
              await postTerm({
                termbaseUUID: data.termbaseUUID,
                langSecUUID: data.langSecUUID,
                value,
                onInit: () => setLoading(true),
                onError: (errorMessage: string) => NotificationManager.error(errorMessage),
                onFinish: () => setLoading(false),
                onSuccess: async () => {
                  NotificationManager.success(
                    "New term successfully created"
                  );
                  await onSuccess();
                  reset();
                  onClose()
                }
              })
            } finally {}
          }}
        >
          <label 
            htmlFor="value"
            className="add-term-modal__input-label"
          >
            Value:
          </label>
          <br />
          <input
            type="text"
            className="add-term-modal__input"
            required
            id="value"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
          <br />
          <br />
          <input
            className="add-term-modal__save-button"
            type="submit"
          /> 
        </form>
      </div>
    </Modal>
  )
}

export default AddTermModal;