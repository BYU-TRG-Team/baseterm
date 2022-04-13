import React from "react";
import Modal from "react-bootstrap-modal";
import "react-bootstrap-modal/lib/css/rbm-complete.css"
import "./index.css";

interface Props {
  isOpen: boolean,
  header: string,
  onClose: () => void,
  children: JSX.Element,
}

const ModalComponent: React.FC<Props> = ({
  isOpen,
  header,
  onClose,
  children,
}) => {

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title 
          id='ModalHeader'
          className="modal__title"
        >
          { header }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { children }
      </Modal.Body>
    </Modal>
  )
}

export default ModalComponent;