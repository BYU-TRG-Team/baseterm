import React, { useEffect, useState } from "react";
import Modal from "../../Modal"
import { AuxElement, TermNote } from "../../../types/tbxElements";
import { getAuthToken, isAuthorized, tbxEntityTypeToHeading } from "../../../utils";
import { TbxElement } from "../../../types/tbxElements";
import EditableField from "../../EditableField";
import DragAndDropList from "../../widgets/DragAndDropList";
import AuxElementModal from "../AuxElementModal";
import DeleteWidget from "../../widgets/DeleteWidget";
import "./index.css";
import { ModalProps } from "../types";
import { NoteLinkInfoAuxElements } from "../../../data/auxElementGroups";
import AddAuxElementModal from "../AddAuxElementModal";
import { patchAuxElement, patchTermNote } from "../../../services/api/baseterm";
import { NotificationManager } from "react-notifications";
import { termNoteDataCategories } from "../../../data/dataCategoryConfigs";
import LanguageDropdown from "../../dropdowns/LanguageDropdown";
import DataCategoryWidget from "../../widgets/DataCategoryWidget";
import { deleteTermNote } from "../../../services/api/baseterm";
import LoadingSpinner from "../../LoadingSpinner";
import AuthorizationWrapper from "../../AuthorizationWrapper";

interface Props extends ModalProps<TermNote> {
  isOpen: boolean,
  onClose: () => void;
  data: TermNote;
  onUpdate: () => Promise<void>;
  enforceTbxBasic?: boolean;
}

const TermNoteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  onUpdate,
  enforceTbxBasic = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedAuxElement, setSelectedAuxElement] = useState<undefined | AuxElement>();
  const [showAddAuxElementModal, setShowAddAuxElementModal] = useState(false);

  useEffect(() => {
    if (
      selectedAuxElement !== undefined &&
      data.auxElements !== undefined
    ) {
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
          data.elementType
        ) 
      }
      onClose={onClose}
    >
      <>
        <LoadingSpinner show={loading} />
        <AuthorizationWrapper
            desiredPrivilege="WRITE"
            role={authToken.role}
        >
          <DeleteWidget 
            handleDelete={async () => {
              try {
                await deleteTermNote({
                  uuid: data.uuid,
                  termbaseUUID: data.termbaseUUID,
                  onInit: () => setLoading(true),
                  onError: (errorMessage) => NotificationManager.error(errorMessage),
                  onFinish: () => setLoading(false)
                });
                
                onUpdate();
                onClose();
              } finally {}
            }} 
            resourceName={
              tbxEntityTypeToHeading(data.elementType)
            }
          />
        </AuthorizationWrapper>
        <hr className="term-note-modal__hr" />
        <div>
          <EditableField 
            value={data.id === null ? "" : data.id}
            onSave={async (id: string) => {
              return patchTermNote({
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
          <label className="term-note-modal__label">
            Data Category:
          </label>
          <br />
          <br />
          <DataCategoryWidget 
            onSubmit={(
              type, value
            ) => {
              if (
                type.length > 0 &&
                value.length > 0
              ) {
                return patchTermNote({
                  type,
                  value,
                  termbaseUUID: data.termbaseUUID,
                  uuid: data.uuid,
                  onError: (errorMessage) => NotificationManager.error(errorMessage),
                  onSuccess: onUpdate,
                })
              }
            }}
            isField={true}
            tbxElement={
              TbxElement.TermNote
            }
            dataCategories={
              termNoteDataCategories
            }
            initialType={data.type}
            initialValue={data.value}
            enforceTbxBasic={enforceTbxBasic}
            editingAuthorized={hasWritePrivilege}
            
          />
          <br />
          <br />
          {
            data.elementType === TbxElement.TermNoteGrp &&
            <EditableField 
              value={data.grpId === null ? "" : data.grpId}
              onSave={async (grpId: string) => {
                return patchTermNote({
                  grpId,
                  termbaseUUID: data.termbaseUUID,
                  uuid: data.uuid,
                  onError: (errorMessage) => NotificationManager.error(errorMessage),
                  onSuccess: onUpdate
                })
              }}
              label="Group ID"
              enableEditing={hasWritePrivilege}
            />
          }
          <EditableField 
            value={data.target === null ? "" : data.target}
            onSave={async (target: string) => {
              return patchTermNote({
                target,
                termbaseUUID: data.termbaseUUID,
                uuid: data.uuid,
                onError: (errorMessage) => NotificationManager.error(errorMessage),
                onSuccess: onUpdate,
              })
            }}
            label="Target"
            enableEditing={hasWritePrivilege}
          />
          <EditableField 
            value={data.datatype === null ? "" : data.datatype}
            onSave={async (datatype: string) => {
              return patchTermNote({
                datatype,
                termbaseUUID: data.termbaseUUID,
                uuid: data.uuid,
                onError: (errorMessage) => NotificationManager.error(errorMessage),
                onSuccess: onUpdate,
              })
            }}
            label="Datatype"
            enableEditing={hasWritePrivilege}
          />
          <label className="term-note-modal__label">
            Language:
          </label>
          <br />
          <br />
          <LanguageDropdown 
            onChange={(e) => {
              return patchTermNote({
                langCode: e.target.value,
                termbaseUUID: data.termbaseUUID,
                uuid: data.uuid,
                onError: (errorMessage) => NotificationManager.error(errorMessage),
                onSuccess: onUpdate,
              })
            }}
            selectedLangCode={data.xmlLang || ""}
            nullable
            disabled={!hasWritePrivilege}
          />
          {
            data.auxElements !== undefined ? 
            (
              <>
                <h3 className="term-note-modal__sub-heading">
                  Note Link Info
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
                      setSelectedAuxElement(auxElement)
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
                    auxElements: NoteLinkInfoAuxElements,
                    termbaseUUID: data.termbaseUUID,
                    parentUUID: data.uuid,
                    parentElementType: TbxElement.TermNote,
                  }}
                  onClose={() => setShowAddAuxElementModal(false)}
                  isOpen={showAddAuxElementModal}
                  tbxElement={TbxElement.TermNote}
                  onSuccess={onUpdate}
                  enforceTbxBasic={enforceTbxBasic}
                />
              </>
            ) : 
            <></>
          }
          {
            selectedAuxElement &&
            <AuxElementModal 
              data={selectedAuxElement}
              isOpen={true}
              onClose={() => {
                setSelectedAuxElement(undefined)
              }}
              onUpdate={onUpdate}
              parentElementType={TbxElement.TermNote}
              enforceTbxBasic={enforceTbxBasic}
            />
          }
        </div>
      </>
    </Modal>
  )
}

export default TermNoteModal;