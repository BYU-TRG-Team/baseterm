import React, { useEffect, useState } from "react";
import Modal from "../../Modal"
import { 
  AuxElement, 
  TermFullView, 
  TermNote 
} from "../../../types/tbxElements";
import { getAuthToken, isAuthorized, tbxEntityTypeToHeading } from "../../../utils";
import { TbxElement } from "../../../types/tbxElements";
import EditableField from "../../EditableField";
import DragAndDropList from "../../widgets/DragAndDropList";
import AuxElementModal from "../AuxElementModal";
import "./index.css";
import TermNoteModal from "../TermNoteModal";
import DeleteWidget from "../../widgets/DeleteWidget";
import { ModalProps } from "../types";
import AddAuxElementModal from "../AddAuxElementModal";
import { AuxInfoAuxElements } from "../../../data/auxElementGroups";
import AddTermNoteModal from "../AddTermNoteModal";
import { UUID } from "../../../types";
import LoadingSpinner from "../../LoadingSpinner";
import { deleteTerm, patchAuxElement, patchTerm, patchTermNote } from "../../../services/api/baseterm";
import { NotificationManager } from "react-notifications";
import AuthorizationWrapper from "../../AuthorizationWrapper";

interface Props extends ModalProps<TermFullView> {
  isOpen: boolean,
  onClose: () => void,
  data: TermFullView,
  handleGetConceptEntry: (conceptEntryUUID: UUID) => void,
  handleGetLanguageSection: (langSecUUID: UUID) => void,
  onDelete: () => void,
  onUpdate: () => Promise<void>,
  enforceTbxBasic?: boolean,
}

const TermModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  handleGetConceptEntry,
  handleGetLanguageSection,
  onDelete,
  onUpdate,
  enforceTbxBasic = true,
}) => {
  const [selectedAuxElement, setSelectedAuxElement] = useState<AuxElement | undefined>(undefined);
  const [selectedTermNote, setSelectedTermNote] = useState<TermNote | undefined>(undefined);
  const [showAddAuxElementModal, setShowAddAuxElementModal] = useState(false);
  const [showAddTermNoteModal, setShowAddTermNoteModal] = useState(false);
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

    if (selectedTermNote !== undefined) {
      const updatedTermNote = data.termNotes.filter((auxElement) => {
        return auxElement.uuid === selectedTermNote.uuid;
      })[0] as TermNote | undefined;

      setSelectedTermNote(
        updatedTermNote
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
          TbxElement.Term
        ) 
      }
      onClose={onClose}
    >
      <div>
        <LoadingSpinner show={loading} />
        <div className="term-modal__button-wrapper">
          <AuthorizationWrapper
            desiredPrivilege="WRITE"
            role={authToken.role}
          >
            <DeleteWidget 
              handleDelete={async () => {
                try {
                  await deleteTerm({
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
                tbxEntityTypeToHeading(
                  TbxElement.Term
                )
              }
            />
          </AuthorizationWrapper>
          <div className="term-modal__button-wrapper">
            <button 
              className="term-modal__element-preview"
              onClick={async () =>{
                setLoading(true);
                await handleGetConceptEntry(
                  data.conceptEntry.uuid
                );
                setLoading(false);
              }}
            >
              Concept Entry
            </button>
            <button 
              className="term-modal__element-preview"
              onClick={async () =>{
                setLoading(true);
                await handleGetLanguageSection(
                  data.languageSection.uuid,
                );
                setLoading(false);
              }}
            >
              Language Section
            </button>
          </div>
        </div>
        <hr className="term-modal__hr" />
        <EditableField 
          value={data.id === null ? "" : data.id}
          onSave={async (id: string) => {
            return patchTerm({
              id,
              termbaseUUID: data.termbaseUUID,
              uuid: data.uuid,
              onError: (errorMessage) => NotificationManager.error(errorMessage),
              onSuccess: onUpdate,
            })
          }}
          label="ID"
          enableEditing={hasWritePrivilege}
        />
        <EditableField 
          value={data.termSecId === null ? "" : data.termSecId}
          onSave={async (termSecId: string) => {
            return patchTerm({
              termSecId,
              termbaseUUID: data.termbaseUUID,
              uuid: data.uuid,
              onError: (errorMessage) => NotificationManager.error(errorMessage),
              onSuccess: onUpdate,
            })
          }}
          label="Term Section ID"
          enableEditing={hasWritePrivilege}
        />
        <EditableField 
          value={data.value}
          onSave={async (value: string) => {
            return patchTerm({
              value,
              termbaseUUID: data.termbaseUUID,
              uuid: data.uuid,
              onError: (errorMessage) => NotificationManager.error(errorMessage),
              onSuccess: onUpdate,
            })
          }}
          label="Value"
          enableEditing={hasWritePrivilege}
        />
        <h3 className="term-modal__sub-heading">
          Term Notes
        </h3>
        <DragAndDropList<TermNote>
          list={data.termNotes.map((termNote, index) => ({
            data: termNote,
            id: index,
            elementType: termNote.elementType,
            value: termNote.value,
            dataCategory: termNote.type,
            onClick: () => {
              setSelectedTermNote(termNote);
            }
          }))}
          onChange={async (items) => {
            for (let order = 0; order < items.length; ++order) {
              const item = items[order];
              await patchTermNote({
                order,
                termbaseUUID: item.data.termbaseUUID,
                uuid: item.data.uuid,
                onError: (errorMessage) => NotificationManager.error(errorMessage),
              })
            }
            onUpdate();
          }}
          onAddItem={() => setShowAddTermNoteModal(true)}
          showAddItemButton={hasWritePrivilege}
        />
        <h3 className="term-modal__sub-heading">
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
            termbaseUUID: data.termbaseUUID,
            parentUUID: data.uuid,
            parentElementType: TbxElement.Term,
            auxElements: AuxInfoAuxElements,
          }}
          onClose={() => setShowAddAuxElementModal(false)}
          isOpen={showAddAuxElementModal}
          tbxElement={TbxElement.Term}
          onSuccess={onUpdate}
          enforceTbxBasic={enforceTbxBasic}
        />
        <AddTermNoteModal
          onClose={() => setShowAddTermNoteModal(false)}
          isOpen={showAddTermNoteModal} 
          data={{
            termUUID: data.uuid,
            termbaseUUID: data.termbaseUUID
          }}
          onSuccess={onUpdate}
          enforceTbxBasic={enforceTbxBasic}        
        />
        {
          selectedTermNote !== undefined &&
          <TermNoteModal 
            data={selectedTermNote}
            isOpen={true}
            onClose={() => {
              setSelectedTermNote(undefined);
            }}
            onUpdate={onUpdate}
            enforceTbxBasic={enforceTbxBasic}
          />
        }
        {
          selectedAuxElement &&
          <AuxElementModal 
            data={selectedAuxElement}
            isOpen={true}
            onClose={() => {
              setSelectedAuxElement(undefined);
            }}
            onUpdate={onUpdate}
            parentElementType={TbxElement.Term}
            enforceTbxBasic={enforceTbxBasic}
          />
        }
      </div>
    </Modal>
  )
}

export default TermModal;