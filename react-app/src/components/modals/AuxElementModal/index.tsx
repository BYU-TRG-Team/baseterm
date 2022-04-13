
import React, { useEffect, useState } from "react";
import Modal from "../../Modal"
import { AuxElement, TbxElement } from "../../../types/tbxElements";
import { getAuthToken, isAuthorized, mapTbxElementToDataCategories, tbxEntityTypeToHeading } from "../../../utils";
import EditableField from "../../EditableField";
import DragAndDropList from "../../widgets/DragAndDropList";
import DeleteWidget from "../../widgets/DeleteWidget";
import { ModalProps } from "../types";
import AddAuxElementModal from "../AddAuxElementModal";
import "./index.css";
import { 
  AdminGrpAuxElements,
  DescripGrpAuxElements,
  TransacGrpAuxElements,
} from "../../../data/auxElementGroups";
import { patchAuxElement } from "../../../services/api/baseterm";
import { NotificationManager } from "react-notifications";
import LanguageDropdown from "../../dropdowns/LanguageDropdown";
import DataCategoryWidget from "../../widgets/DataCategoryWidget";
import deleteAuxElement from "../../../services/api/baseterm/deleteAuxElement";
import LoadingSpinner from "../../LoadingSpinner";
import AuthorizationWrapper from "../../AuthorizationWrapper";


interface Props extends ModalProps<AuxElement> {
  data: AuxElement,
  isOpen: boolean, 
  onClose: () => void,
  onUpdate: () => Promise<void>,
  parentElementType: TbxElement,
  enforceTbxBasic?: boolean,
}

const AuxElementModal: React.FC<Props> = ({ 
  data,
  isOpen, 
  onClose,
  onUpdate,
  parentElementType,
  enforceTbxBasic = true,
}) => {

  const [loading, setLoading] = useState(false);
  const [selectedAuxElement, setSelectedAuxElement] = useState<undefined | AuxElement>(undefined);
  const [showAddAuxElementModal, setShowAddAuxElementModal] = useState(false);
  const dataCategories = mapTbxElementToDataCategories(
    data.elementType
  );
  const auxElements = (() => {
    switch(data.elementType) {
      case (TbxElement.AdminGrp):
        return AdminGrpAuxElements;

      case (TbxElement.DescripGrp):
        return DescripGrpAuxElements;

      case (TbxElement.TransacGrp):
        return TransacGrpAuxElements;
      
      default:
        return [];
    }
  })();

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
      header={tbxEntityTypeToHeading(data.elementType)}
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
                await deleteAuxElement({
                  uuid: data.uuid,
                  termbaseUUID: data.termbaseUUID,
                  elementType: data.elementType,
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
        <hr className="aux-element-modal__hr" />
        {
           data.id !== undefined &&
           <EditableField
            label="ID"
            value={data.id || ""}
            onSave={(id) => {
              return patchAuxElement({
                elementType: data.elementType,
                id,
                termbaseUUID: data.termbaseUUID,
                uuid: data.uuid,
                onError: (errorMessage) => NotificationManager.error(errorMessage),
                onSuccess: onUpdate,
              })
            }}
            enableEditing={hasWritePrivilege}
           />
        }
        {
           data.grpId !== undefined &&
           <EditableField
            label="Group ID"
            value={data.grpId || ""}
            onSave={(grpId) => {
              return patchAuxElement({
                elementType: data.elementType,
                grpId,
                termbaseUUID: data.termbaseUUID,
                uuid: data.uuid,
                onError: (errorMessage) => NotificationManager.error(errorMessage),
                onSuccess: onUpdate,
              })
            }}
            enableEditing={hasWritePrivilege}
           />
        }
        {
           data.target !== undefined &&
           <EditableField
            label="Target"
            value={data.target || ""}
            onSave={(target) => {
              return patchAuxElement({
                elementType: data.elementType,
                target,
                termbaseUUID: data.termbaseUUID,
                uuid: data.uuid,
                onError: (errorMessage) => NotificationManager.error(errorMessage),
                onSuccess: onUpdate,
              })
            }}
            enableEditing={hasWritePrivilege}
           />
        }
        {
           dataCategories !== null &&
           <>
            <label className="aux-element-modal__input-label">
              Data Category:
            </label>
            <br />
            <br />
            <DataCategoryWidget 
              isField
              tbxElement={parentElementType}
              dataCategories={dataCategories}
              initialType={data.type || ""}
              initialValue={data.value || ""}
              enforceTbxBasic={enforceTbxBasic}
              onSubmit={(
                type,
                value
              ) => {
                return patchAuxElement({
                  elementType: data.elementType,
                  type,
                  value,
                  termbaseUUID: data.termbaseUUID,
                  uuid: data.uuid,
                  onError: (errorMessage) => NotificationManager.error(errorMessage),
                  onSuccess: onUpdate,
                })
              }}
              editingAuthorized={hasWritePrivilege}
            />
            <br />
            <br />
          </>
        }
        {
            dataCategories === null &&
            <EditableField
              label="Value"
              value={data.value || ""}
              onSave={(value) => {
                return patchAuxElement({
                  elementType: data.elementType,
                  value,
                  termbaseUUID: data.termbaseUUID,
                  uuid: data.uuid,
                  onError: (errorMessage) => NotificationManager.error(errorMessage),
                  onSuccess: onUpdate,
                })
              }}
              enableEditing={hasWritePrivilege}
            />
        }
        {
          data.xmlLang !== undefined &&
          <>
            <label
              htmlFor="languageSection"
              className="aux-element-modal__input-label"
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
              nullable
              onChange={(e) => {
                return patchAuxElement({
                  elementType: data.elementType,
                  langCode: e.target.value,
                  termbaseUUID: data.termbaseUUID,
                  uuid: data.uuid,
                  onError: (errorMessage) => NotificationManager.error(errorMessage),
                  onSuccess: onUpdate,
                })
              }}
              disabled={!hasWritePrivilege}
            />
            <br />
            <br />
          </>
        }
        {
          data.datatype !== undefined &&
          <EditableField
            label="Datatype"
            value={data.datatype || ""}
            onSave={(datatype) => {
              return patchAuxElement({
                elementType: data.elementType,
                datatype,
                termbaseUUID: data.termbaseUUID,
                uuid: data.uuid,
                onError: (errorMessage) => NotificationManager.error(errorMessage),
                onSuccess: onUpdate,
              })
            }}
            enableEditing={hasWritePrivilege}
          />
        }
        {
          data.auxElements !== undefined &&
          (
            <>
              <h3 className="aux-element-modal__sub-heading">
                Auxillary Elements
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
                  auxElements,
                  termbaseUUID: data.termbaseUUID,
                  parentUUID: data.uuid,
                  parentElementType: data.elementType
                }}
                onClose={() => setShowAddAuxElementModal(false)}
                isOpen={showAddAuxElementModal}
                tbxElement={data.elementType}
                onSuccess={onUpdate}
                enforceTbxBasic={enforceTbxBasic}
              />
            </>
          )
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
            parentElementType={data.elementType}
            enforceTbxBasic={enforceTbxBasic}
          />
       }
      </>
    </Modal>
  )
  
}

export default AuxElementModal;