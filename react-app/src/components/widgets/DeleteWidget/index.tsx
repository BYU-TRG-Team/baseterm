import React, { useState } from "react";
import DeleteModal from "../../modals/DeleteModal";


interface Props {
  handleDelete: () => Promise<void>,
  resourceName: string,
}

const DeleteWidget: React.FC<Props> = ({
  resourceName,
  handleDelete
}) => {
  const [showDeleteModal, setShowDeleteModal ] = useState(false);

  return (
    <>
      <DeleteModal 
        onClose={() => setShowDeleteModal(false)}
        isOpen={showDeleteModal}
        data={`Are you sure you want to delete this ${resourceName.toLocaleLowerCase()}?`}
        onSubmit={async () => {
          try {
            await handleDelete();
          } finally {
            setShowDeleteModal(false);
          }
        }}
      />
      <button 
        style={{ cursor: "pointer" }}
        onClick={() => setShowDeleteModal(true)}
      >
        Delete
      </button>
    </>
  )
}   

export default DeleteWidget;