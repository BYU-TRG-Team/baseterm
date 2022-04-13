import React, { useState } from "react";
import Modal from "../../Modal"
import './index.css';
import LanguageDropdown from "../../dropdowns/LanguageDropdown";
import { TbxAuxElement } from "../../../types/tbxElements";
import { ModalProps } from "../types";
import { LangCode, UUID } from "../../../types";
import LoadingSpinner from "../../LoadingSpinner";
import { postLangSec } from "../../../services/api/baseterm";
import { NotificationManager } from "react-notifications";

interface ModalData {
  termbaseUUID: UUID,
  entryUUID: UUID,
}

interface Props extends ModalProps<ModalData> {
  data: ModalData,
  onClose: () => void;
  isOpen: boolean,
  onSuccess: () => Promise<void>
}

const AddLanguageSectionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  onSuccess
}) => {
  const [langCode, setLangCode] = useState<LangCode>("");
  const [initialTerm, setInitialTerm] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const reset = () => {
    setLangCode("");
    setInitialTerm("");
  }

  const {
    termbaseUUID,
    entryUUID,
  } = data;
 
  return (
    <Modal 
      isOpen={isOpen} 
      header="New Language Section"
      onClose={onClose}
    >
      <div className="add-language-section__content">
        <LoadingSpinner show={loading} />
        <form 
          onSubmit={async (e) => {
            e.preventDefault()
            try {
              await postLangSec({
                termbaseUUID,
                entryUUID,
                langCode,
                initialTerm,
                onInit: () => setLoading(true),
                onError: (errorMessage: string) => NotificationManager.error(errorMessage),
                onFinish: () => setLoading(false),
                onSuccess: async (response) => {
                  NotificationManager.success(
                    "New language section successfully created"
                  );
                  await onSuccess();
                  reset();
                  onClose();
                }
              })
            } finally {}
          }}
        >
          <label 
            htmlFor="language"
            className="add-language-section__input-label"
          >
            Language:
          </label>
          <br />
          <LanguageDropdown 
            htmlId="language"
            onChange={(event) => {
              setLangCode(event.target.value);
            }}
          />
          <br />
          <br />
          <label 
            htmlFor="language"
            className="add-language-section__input-label"
          >
            Initial Term:
          </label>
          <br />
          <input 
            type="text"
            className="add-language-section__input-label"
            required
            id="value"
            value={initialTerm}
            onChange={(event) => {
              setInitialTerm(event.target.value)
            }}  
          />
          <br />
          <br />
          <input
            className="add-language-section__save-button"
            type="submit"
          /> 
        </form>
      </div>
    </Modal>
  )
}

export default AddLanguageSectionModal;