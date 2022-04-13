import React, { useState } from "react"; 
import EditText from 'react-editext';
import "./index.css";

interface Props {
  label: string;
  onSave?: (value: string) => Promise<void>
  value: string,
  className?: string;
  enableEditing?: boolean;
}

const EditableField: React.FC<Props> = ({
  onSave = async () => {},
  value,
  className,
  label,
  enableEditing = true,
}) => {

  const [version, setVersion] = useState(0);
  const [currentValue, setCurrentValue] = useState(value);
  const editButtonProps = 
    enableEditing ?
    {} :
    {
      disabled: true,
      style: {
        display: "none"
      }
    };

  if (value !== currentValue) {
    setCurrentValue(value);
    setVersion(version + 1);
  };

  return (
    <div className="editable-field">
      <div className="editable-field__label">
        <strong>
          { label }:
        </strong>
      </div>
      <EditText
        type="textarea"
        editButtonProps={editButtonProps}
        key={version}
        className={`editable-field__input ${className}`}
        value={currentValue}
        onSave={async (value: string) => {
          await onSave(value);
          setCurrentValue(value);
        }}
      />
      <br />
      <br />
    </div>
  )
};

export default EditableField