import React, { useEffect, useState } from "react";
import Modal from "../../Modal"
import { 
  AuxElement, 
  LanguageSection, 
  TermPreview
} from "../../../types/tbxElements";
import { getAuthToken, isAuthorized, tbxEntityTypeToHeading } from "../../../utils";
import { TbxElement } from "../../../types/tbxElements";
import DragAndDropList from "../../widgets/DragAndDropList";
import AuxElementModal from "../AuxElementModal";
import "./index.css";
import DeleteWidget from "../../widgets/DeleteWidget";
import { ModalProps } from "../types";
import AddAuxElementModal from "../AddAuxElementModal";
import { AuxInfoAuxElements } from "../../../data/auxElementGroups";
import AddTermModal from "../AddTermModal";
import { UUID } from "../../../types";
import LoadingSpinner from "../../LoadingSpinner";
import { deleteLangSec, patchAuxElement, patchLangSec, patchTerm } from "../../../services/api/baseterm";
import { NotificationManager } from "react-notifications";
import LanguageDropdown from "../../dropdowns/LanguageDropdown";
import AuthorizationWrapper from "../../AuthorizationWrapper";

interface TermListItem extends TermPreview {
  elementType: TbxElement.Term,
}

interface Props extends ModalProps<LanguageSection> {
  isOpen: boolean,
  onClose: () => void,
  data: LanguageSection,
  handleGetConceptEntry: (conceptEntryUUID: UUID) => void,
  handleGetTerm: (termUUID: UUID) => void,
  onDelete: () => void,
  onUpdate: () => Promise<void>,
  enforceTbxBasic?: boolean,
}

const LanguageSectionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  handleGetConceptEntry,
  handleGetTerm,
  onDelete,
  onUpdate,
  enforceTbxBasic = true,
}) => {

  const [selectedAuxElement, setSelectedAuxElement] = useState<undefined | AuxElement>(undefined);
  const [showAddAuxElementModal, setShowAddAuxElementModal] = useState(false);
  const [showAddTermModal, setShowAddTermModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedAuxElement !== undefined) {
      const updatedAuxElement = data.auxElements.filter((auxElement) => {
        return auxElement.uuid === selectedAuxElement.uuid;
      })[0] as AuxElement | undefined;

      setSelectedAuxElement(
        updatedAuxElement
      );
    }
  }, [data]);

  const authToken = getAuthToken();
  if (authToken === null) return <></>;

  const hasWritePrivilege = isAuthorized(
    "WRITE",
    authToken?.role
  );

  return (
    <Modal 
      isOpen={isOpen} 
      header={
        tbxEntityTypeToHeading(
          TbxElement.LangSec
        ) 
      }
      onClose={onClose}
    >
      <div>
        <LoadingSpinner show={loading} />
        <div className="lang-sec-modal__button-wrapper">
          <AuthorizationWrapper
              desiredPrivilege="WRITE"
              role={authToken.role}
          >
            <DeleteWidget 
              handleDelete={async () => {
                try {
                  await deleteLangSec({
                    uuid: data.uuid,
                    termbaseUUID: data.termbaseUUID,
                    onInit: () => setLoading(true),
                    onError: (errorMessage) => NotificationManager.error(errorMessage),
                    onFinish: () => setLoading(false)
                  });

                  onDelete();
                  onClose();
                } finally {}
              }}
              resourceName={
                tbxEntityTypeToHeading(TbxElement.LangSec)
              }
            />
          </AuthorizationWrapper>
          <div className="lang-sec-modal__button-wrapper">
            <button 
              className="lang-sec-modal__element-preview"
              onClick={async () => {
                setLoading(true);
                await handleGetConceptEntry(
                  data.conceptEntry.uuid,
                );
                setLoading(false);
              }}
            >
              Concept Entry
            </button>
          </div>
        </div>
        <hr className="lang-sec-modal__hr" />
        <label 
          htmlFor="languageSection"
          className="lang-sec-modal__input-label"
        >
          Language:
        </label>
        <br />
        <br />
        <LanguageDropdown 
          selectedLangCode={
            data.xmlLang === null ?
            undefined :
            data.xmlLang
          }
          onChange={(e) => {
            return patchLangSec({
              langCode: e.target.value,
              termbaseUUID: data.termbaseUUID,
              uuid: data.uuid,
              onError: (errorMessage) => NotificationManager.error(errorMessage),
              onSuccess: onUpdate,
            })
          }}
          disabled={!hasWritePrivilege}
        />
        <h3 className="lang-sec-modal__sub-heading">
          Terms
        </h3>
        <DragAndDropList<TermListItem>
          list={data.terms.map((term, index) => ({
            data: {
              ...term,
              elementType: TbxElement.Term,
            },
            id: index,
            elementType: TbxElement.Term,
            value: term.value,
            onClick: async () => {
              setLoading(true);
              await handleGetTerm(
                term.uuid,
              );
              setLoading(false);
            }
          }))}
          onChange={async (items) => {
            for (let order = 0; order < items.length; ++order) {
              const item = items[order];
              await patchTerm({
                order,
                termbaseUUID: item.data.termbaseUUID,
                uuid: item.data.uuid,
                onError: (errorMessage) => NotificationManager.error(errorMessage),
              })
            }
            onUpdate();
          }}
          onAddItem={() => setShowAddTermModal(true)}
          showAddItemButton={hasWritePrivilege}
        />
        <h3 className="lang-sec-modal__sub-heading">
          Auxillary Info
        </h3>
        <DragAndDropList<AuxElement> 
          list={data.auxElements.map((auxElement, index) => ({
            data: auxElement,
            id: index,
            elementType: auxElement.elementType,
            value: auxElement.value,
            dataCategory: (
              auxElement.type === null ?
                undefined :
                auxElement.type
            ),
            onClick: () => {
              setSelectedAuxElement(auxElement);
            }
          }))}
          onChange={async (items) => {
            for (let order = 0; order < items.length; ++order) {
              const item = items[order];
              await patchAuxElement({
                elementType: item.elementType,
                order,
                termbaseUUID: item.data.termbaseUUID,
                uuid: item.data.uuid,
                onError: (errorMessage) => NotificationManager.error(errorMessage),
              })
            }
            onUpdate();
          }}
          onAddItem={() => setShowAddAuxElementModal(true)}
          showAddItemButton={hasWritePrivilege}
        />
        <AddAuxElementModal 
          data={{
            auxElements: AuxInfoAuxElements,
            termbaseUUID: data.termbaseUUID,
            parentUUID: data.uuid,
            parentElementType: TbxElement.LangSec,
          }}
          onClose={() => setShowAddAuxElementModal(false)}
          isOpen={showAddAuxElementModal}
          tbxElement={TbxElement.LangSec}
          onSuccess={onUpdate}
          enforceTbxBasic={enforceTbxBasic}
        />
        <AddTermModal 
          onClose={() => setShowAddTermModal(false)}
          isOpen={showAddTermModal} 
          data={{
            termbaseUUID: data.termbaseUUID,
            langSecUUID: data.uuid,
          }}  
          onSuccess={onUpdate}    
        />
        {
          selectedAuxElement &&
          <AuxElementModal 
            data={selectedAuxElement}
            isOpen={true}
            onClose={() => {
              setSelectedAuxElement(undefined);
            }}
            onUpdate={onUpdate}
            parentElementType={TbxElement.LangSec}
            enforceTbxBasic={enforceTbxBasic}
          />
        }
      </div>
    </Modal>
  )
}

export default LanguageSectionModal;