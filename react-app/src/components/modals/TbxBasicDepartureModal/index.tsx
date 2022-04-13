import React from "react";
import Modal from "../../Modal"
import './index.css';
import { ModalProps } from "../types";

interface Props extends ModalProps<string> {
  onClose: () => void;
  isOpen: boolean,
  data: string;
  onSubmit: () => void;
}

const TbxBasicDepartureModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  onSubmit,
}) => {

  return (
    <Modal 
      isOpen={isOpen} 
      header="Tbx-Basic Departure Confirmation"
      onClose={onClose}
    >
      <div className="tbx-basic-departure-modal__content">
        <div>
          { data }
        </div>
        <br />
        <button 
          onClick={onClose}
          style={{
            cursor: "pointer",
          }}  
        >
          Cancel
        </button>
        <button 
          onClick={onSubmit}
          style={{
            cursor: "pointer",
          }}
        >
          Continue
        </button>
      </div>
    </Modal>
  )
}

export default TbxBasicDepartureModal;