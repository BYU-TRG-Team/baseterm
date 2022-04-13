import { ModalProps } from "../types";
import { UUID } from "../../../types";
import { TbxAuxElement, TbxElement } from "../../../types/tbxElements";
import { useState } from "react";
import { mapTbxElementToDataCategories } from "../../../utils";
import Modal from "../../Modal";
import { postAuxElement } from "../../../services/api/baseterm";
import { NotificationManager } from "react-notifications";
import AuxElementDropdown from "../../dropdowns/AuxElementDropdown";
import LoadingSpinner from "../../LoadingSpinner";
import DataCategoryWidget from "../../widgets/DataCategoryWidget";
import "./index.css";

interface Props extends ModalProps<{
  auxElements: TbxAuxElement[],
  termbaseUUID: UUID,
  parentUUID: UUID,
  parentElementType: TbxElement,
}> {
  onClose: () => void;
  isOpen: boolean,
  tbxElement: TbxElement,
  onSuccess: () => Promise<void>,
  enforceTbxBasic?: boolean,
}

const AddAuxElementModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  tbxElement,
  onSuccess,
  enforceTbxBasic
}) => {

  const [loading, setLoading] = useState(false);
  const [selectedAuxElement, setSelectedAuxElement] = useState<null | TbxAuxElement>(null);
  const [value, setValue] = useState("");
  const [type, setType] = useState<null | string>(null);
  const [target, setTarget] = useState<null | string>(null);
  const dataCategories = 
    selectedAuxElement !== null ?
    mapTbxElementToDataCategories(
      selectedAuxElement
    ) :
    null;
  const reset = () => {
    setSelectedAuxElement(null);
    setValue("");
    setType(null);
    setTarget(null);
  }
  const handleClose = () => {
    reset();
    onClose();
  }
  const isSingleValueElement = 
    selectedAuxElement !== null &&
    [
      TbxElement.Date,
      TbxElement.Note,
    ].includes(selectedAuxElement)

  return (
    <Modal 
      isOpen={isOpen} 
      header="New Auxillary Element"
      onClose={handleClose}
    >
      <div className="add-aux-element-modal__content">
        <LoadingSpinner show={loading} />
        <form 
          onSubmit={async (e) => {
          e.preventDefault()
          if (selectedAuxElement === null) return;

          try {
            await postAuxElement({
              termbaseUUID: data.termbaseUUID,
              parentUUID: data.parentUUID,
              parentElementType: tbxElement,
              elementType: selectedAuxElement,
              value,
              ...(type !== null && { type }),
              ...(target !== null && { target }),
              onInit: () => setLoading(true),
              onError: (errorMessage: string) => NotificationManager.error(errorMessage),
              onFinish: () => setLoading(false),
              onSuccess: async (response) => {
                NotificationManager.success(
                  "New aux element successfully created"
                );
                await onSuccess();
                reset();
                handleClose();
              }
            })  
          } finally {}
        }}
        >
          <label 
            htmlFor="elementType"
            className="add-aux-element-modal__input-label"
          >
            Element Type:
          </label>
          <br />
          <AuxElementDropdown 
            htmlId="elementType"
            onChange={(e) => {
              setSelectedAuxElement(e.target.value as TbxAuxElement);
              setValue("");
              setType(null);
              setTarget(null);
            }}
            dataCategories={data.auxElements}
          />
          <br />
          <br />
          {
            selectedAuxElement === TbxElement.Xref &&
            <>
              <label 
                htmlFor="target"
                className="add-aux-element-modal__input-label"
              >
                Target:
              </label>
              <br />
              <input
                className="add-aux-element-modal__input"
                required
                id="target"
                value={target || ""}
                onChange={(event) => {
                  setTarget(event.target.value);
                }}
              />
              <br />
              <br />
            </>
          }
          {
            selectedAuxElement !== null &&
            !isSingleValueElement &&
            <>
              <DataCategoryWidget 
                tbxElement={tbxElement}
                dataCategories={dataCategories || []}
                enforceTbxBasic={enforceTbxBasic}
                initialType={type || ""}
                initialValue={value || ""}
                onChange={(
                  type,
                  value
                ) => {
                  setType(type);
                  setValue(value);
                }}
              />
              <br />
              <br />
            </>
          }
          {
            isSingleValueElement &&
            <>
              <label 
                htmlFor="value"
                className="add-aux-element-modal__input-label"
              >
                Value:
              </label>
              <br />
              <input
                className="add-aux-element-modal__input"
                required
                id="value"
                value={value || ""}
                onChange={(event) => {
                  setValue(event.target.value);
                }}
              />
              <br />
              <br />
            </>
          }
          <input
            className="add-aux-element-modal__save-button"
            type="submit"
          /> 
        </form>
      </div>
    </Modal>
  )
}

export default AddAuxElementModal;