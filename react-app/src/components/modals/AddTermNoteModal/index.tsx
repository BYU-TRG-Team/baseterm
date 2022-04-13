import React, { useState } from "react";
import Modal from "../../Modal"
import './index.css';
import AuxElementDropdown from "../../dropdowns/AuxElementDropdown";
import { TbxElement } from "../../../types/tbxElements";
import { ModalProps } from "../types";
import { UUID } from "../../../types";
import { postTermNote } from "../../../services/api/baseterm";
import { NotificationManager } from "react-notifications";
import { termNoteDataCategories } from "../../../data/dataCategoryConfigs";
import DataCategoryWidget from "../../widgets/DataCategoryWidget";

interface Props extends ModalProps<{
  termbaseUUID: UUID,
  termUUID: UUID,
}> {
  onClose: () => void,
  isOpen: boolean,
  onSuccess: () => Promise<void>,
  enforceTbxBasic?: boolean,
}

type TermNoteElement = TbxElement.TermNote | TbxElement.TermNoteGrp;

const AddTermNoteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  onSuccess,
  enforceTbxBasic = true,
}) => {

  const [selectedTermNoteElement, setSelectedTermNoteElement] = useState<null | TermNoteElement>(null);
  const [value, setValue] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const reset = () => {
    setSelectedTermNoteElement(null);
    setValue("");
    setType("");
  }
  const handleClose = () => {
    reset();
    onClose();
  }

  return (
    <Modal 
      isOpen={isOpen} 
      header="New Term Note Element"
      onClose={handleClose}
    >
      <div className="add-term-note-modal__content">
        <form 
          onSubmit={async (e) => {
            e.preventDefault()
            try {
              await postTermNote({
                termbaseUUID: data.termbaseUUID,
                termUUID: data.termUUID,
                type,
                value,
                isGrp: selectedTermNoteElement === TbxElement.TermNoteGrp,
                onInit: () => setLoading(true),
                onError: (errorMessage: string) => NotificationManager.error(errorMessage),
                onFinish: () => setLoading(false),
                onSuccess: async (response) => {
                  NotificationManager.success(
                    "New term note successfully created."
                  );
                  await onSuccess();
                  reset();
                  handleClose()
                }
              })
            } finally {}
        }}
        >
          <label 
            htmlFor="elementType"
            className="add-term-note-modal__input-label"
          >
            Element Type:
          </label>
          <br />
          <AuxElementDropdown 
            htmlId="elementType"
            onChange={(e) => {
              setSelectedTermNoteElement(e.target.value as TermNoteElement);
            }}
            dataCategories={[
              TbxElement.TermNote,
              TbxElement.TermNoteGrp
            ]}
          />
          <br />
          <br />
          <DataCategoryWidget 
            initialType={type}
            initialValue={value}
            onChange={(type, value) => {
              setType(type);
              setValue(value);
            }}
            tbxElement={TbxElement.TermNote}
            dataCategories={termNoteDataCategories}
            enforceTbxBasic={enforceTbxBasic}
          />
          <br />
          <br />
          <input
            className="add-term-note-modal__save-button"
            type="submit"
          /> 
        </form>
      </div>
    </Modal>
  )
}

export default AddTermNoteModal;