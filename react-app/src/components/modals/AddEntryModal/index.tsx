import React, { useState } from "react";
import Modal from "../../Modal"
import './index.css';
import { PostEntryEndpointResponse } from "../../../types/responses";
import { Termbase } from "../../../types/tbxElements";
import LanguageDropdown from "../../dropdowns/LanguageDropdown";
import { ModalProps } from "../types";

interface Props extends ModalProps<Termbase> {
  onClose: () => void;
  isOpen: boolean,
  onSave: (
    entryId: string,
    initialLanguageSection: string,
    initialTerm: string,
  ) => Promise<PostEntryEndpointResponse>
}

const AddEntryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  
  const [entryId, setEntryId] = useState<string>("");
  const [initialLanguageSection, setInitialLanguageSection] = useState<string>("");
  const [initialTerm, setInitialTerm] = useState<string>("");

  return (
    <Modal 
      isOpen={isOpen} 
      header="New Entry"
      onClose={() => {
        onClose();
        setEntryId("");
        setInitialLanguageSection("");
        setInitialTerm("");
      }}
    >
      <div className="add-entry-modal__content">
        <form 
          onSubmit={async (e) => {
            e.preventDefault()
            try {
              await onSave(
                entryId,
                initialLanguageSection,
                initialTerm,
              )
            } finally {}
          }}
        >
          <label 
            htmlFor="name"
            className="add-entry-modal__input-label"
          >
            Entry ID
          </label>
          <br />
          <input
            type="text"
            className="add-entry-modal__input"
            required
            id="name"
            value={entryId}
            onChange={(event) => {
              setEntryId(event.target.value);
            }}
          />
          <br />
          <br />
          <label 
            htmlFor="languageSection"
            className="add-entry-modal__input-label"
          >
            Initial Language Section:
          </label>
          <br />
          <LanguageDropdown 
            onChange={
              (e) => setInitialLanguageSection(e.target.value)
            }
            htmlId="languageSection"
            required={true}
          />
          <br />
          <br />
          <label 
            htmlFor="term"
            className="add-entry-modal__input-label"
          >
            Initial Term:
          </label>
          <br />
          <input
            type="text"
            className="add-entry-modal__input"
            required
            id="term"
            value={initialTerm}
            onChange={(event) => {
              setInitialTerm(event.target.value);
            }}
          />
          <br />
          <br />
          <input
            className="add-entry-modal__save-button"
            type="submit"
          /> 
        </form>
      </div>
    </Modal>
  )
}

export default AddEntryModal;