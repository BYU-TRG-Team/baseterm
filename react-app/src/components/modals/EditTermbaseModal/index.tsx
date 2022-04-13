import React, { useState } from "react";
import Modal from "../../Modal"
import './index.css';
import { Termbase } from "../../../types/tbxElements";
import EditableField from "../../EditableField";
import { ModalProps } from "../types";
import TbxBasicDepartureModal from "../TbxBasicDepartureModal";
import { getAuthToken, isAuthorized } from "../../../utils";

interface Props extends ModalProps<Termbase> {
  onClose: () => void;
  isOpen: boolean,
  data: Termbase,
  onSubmit: (patchTermbaseOptions: {
    name?: string | undefined;
    type?: string | undefined;
    enforceBasicDialect?: boolean | undefined;
  }) => Promise<void>
}

const EditTermbaseModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  onSubmit
}) => {
  const [showDepartureModal, setShowDepartureModal] = useState(false);
  const authToken = getAuthToken();

  if (
    data === null ||
    authToken === null
  ) return <></>;

  const hasWritePrivilege = isAuthorized(
    "WRITE",
    authToken?.role
  )

  return (
    <Modal 
      isOpen={isOpen} 
      header="Termbase Settings"
      onClose={onClose}
    >
      <div className="edit-data-modal__content">
        <EditableField 
          className="edit-data-modal__editable-field"
          value={data.name}
          onSave={async (value: string) => {
            await onSubmit({ name: value })
          }}
          label="Base Name"
          enableEditing={hasWritePrivilege}
        />
        <br />
        <br />
        <EditableField 
          className="edit-data-modal__editable-field"
          value={data.type}
          onSave={async (value: string) => {
            await onSubmit({ type: value })
          }}
          enableEditing={
            !data.enforceBasicDialect &&
            hasWritePrivilege
          }
          label="Base Dialect"
        />
        <br />
        <br />
        { 
          data.enforceBasicDialect &&
          hasWritePrivilege &&
          (
            <>
              <button 
                onClick={() => setShowDepartureModal(true)}
                className="edit-data-modal__dialect-button">
                Depart from TBX-Basic
              </button>
              <TbxBasicDepartureModal
                isOpen={showDepartureModal} 
                onClose={() => setShowDepartureModal(false)}
                data="Are you sure you want to depart from TBX-Basic? Doing so will permanently remove all data category constraints for this termbase."
                onSubmit={async () => {
                  try {
                    await onSubmit({ enforceBasicDialect: false })
                    setShowDepartureModal(false)
                  } finally {}
                }}
              />
            </>
          )
        }
      </div>
    </Modal>
  )
}

export default EditTermbaseModal;