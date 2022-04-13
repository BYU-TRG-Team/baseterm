import React, { useEffect, useState } from "react";
import Modal from "../../Modal"
import { 
  AuxElement, 
  LanguageSectionPreview,
  ConceptEntry
} from "../../../types/tbxElements";
import { getAuthToken, isAuthorized, tbxEntityTypeToHeading } from "../../../utils";
import { TbxElement } from "../../../types/tbxElements";
import EditableField from "../../EditableField";
import DragAndDropList from "../../widgets/DragAndDropList";
import AuxElementModal from "../AuxElementModal";
import "./index.css";
import DeleteWidget from "../../widgets/DeleteWidget";
import { ModalProps } from "../types";
import AddAuxElementModal from "../AddAuxElementModal";
import { AuxInfoAuxElements } from "../../../data/auxElementGroups";
import AddLanguageSectionModal from "../AddLanguageSectionModal";
import { LANGUAGE_CODE_MAP } from "../../../data/languages";
import { UUID } from "../../../types";
import LoadingSpinner from "../../LoadingSpinner";
import { deleteEntry, patchAuxElement, patchEntry, patchLangSec } from "../../../services/api/baseterm";
import { NotificationManager } from "react-notifications";
import AuthorizationWrapper from "../../AuthorizationWrapper";

interface LangSecItem extends LanguageSectionPreview {
  elementType: TbxElement.LangSec,
  value: string;
}

interface Props extends ModalProps<ConceptEntry> {
  isOpen: boolean,
  onClose: () => void,
  data: ConceptEntry,
  handleGetLanguageSection: (langSecUUID: UUID) => void,
  onUpdate: () => Promise<void>,
  onDelete: () => void,
  enforceTbxBasic?: boolean,
}

const ConceptEntryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  onUpdate,
  onDelete,
  handleGetLanguageSection,
  enforceTbxBasic = true,
}) => {

  const [selectedAuxElement, setSelectedAuxElement] = useState<undefined | AuxElement>();
  const [showAddAuxElementModal, setShowAddAuxElementModal] = useState(false);
  const [showAddLanguageSectionModal, setShowAddLanguageSectionModal] = useState(false);
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
          TbxElement.ConceptEntry
        ) 
      }
      onClose={onClose}
    >
      <div>
        <LoadingSpinner show={loading} />
        <div className="concept-entry-modal__button-wrapper">
          <AuthorizationWrapper
              desiredPrivilege="WRITE"
              role={authToken.role}
            >
            <DeleteWidget 
              handleDelete={async () => {
                try {
                  await deleteEntry({
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
                tbxEntityTypeToHeading(TbxElement.ConceptEntry)
              }
            />
          </AuthorizationWrapper>
        </div>
        <hr className="concept-entry-modal__hr" />
        <EditableField 
          value={data.id === null ? "" : data.id}
          onSave={async (value: string) => {
            return patchEntry({
              id: value,
              termbaseUUID: data.termbaseUUID,
              uuid: data.uuid,
              onError: (errorMessage) => NotificationManager.error(errorMessage),
              onSuccess: onUpdate,
            })
          }}
          label="ID"
          enableEditing={hasWritePrivilege}
        />
        <h3 className="concept-entry-modal__sub-heading">
          Language Sections
        </h3>
        <DragAndDropList<LangSecItem>
          list={data.languageSections.map((langSec, index) => ({
            data: {
              ...langSec,
              elementType: TbxElement.LangSec,
              value:  LANGUAGE_CODE_MAP[langSec.xmlLang].join(""),
            },
            id: index,
            elementType: TbxElement.LangSec,
            value: langSec.xmlLang,
            onClick: async () =>{
              setLoading(true);
              await handleGetLanguageSection(
                langSec.uuid,
              );
              setLoading(false);
            }
          }))}
          onChange={async (items) => {
            for (let order = 0; order < items.length; ++order) {
              const item = items[order];
              await patchLangSec({
                order,
                termbaseUUID: item.data.termbaseUUID,
                uuid: item.data.uuid,
                onError: (errorMessage) => NotificationManager.error(errorMessage),
              })
            }
            onUpdate();
          }}
          onAddItem={() => setShowAddLanguageSectionModal(true)}
          showAddItemButton={hasWritePrivilege}
        />
        <h3 className="concept-entry-modal__sub-heading">
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
            parentElementType: TbxElement.ConceptEntry,
          }}
          onClose={() => setShowAddAuxElementModal(false)}
          isOpen={showAddAuxElementModal}
          tbxElement={TbxElement.ConceptEntry}
          onSuccess={onUpdate}
          enforceTbxBasic={enforceTbxBasic}
        />
        <AddLanguageSectionModal
          data={{
            termbaseUUID: data.termbaseUUID,
            entryUUID: data.uuid,
          }}
          onClose={() => setShowAddLanguageSectionModal(false)}
          isOpen={showAddLanguageSectionModal}
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
            parentElementType={TbxElement.ConceptEntry}
            enforceTbxBasic={enforceTbxBasic}
          />
        }
      </div>
    </Modal>
  )
}

export default ConceptEntryModal;