import React, { InputHTMLAttributes, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./index.css";

type Props = InputHTMLAttributes<HTMLInputElement>;

const PasswordField: React.FC<Props> = ({ className = "", ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const VisibilityIcon = (isVisible ? FiEye : FiEyeOff) as React.ElementType;

  return (
    <div className="password-field">
      <input
        {...props}
        type={isVisible ? "text" : "password"}
        className={`password-field__input ${className}`.trim()}
      />
      <button
        type="button"
        className="password-field__toggle"
        aria-label={isVisible ? "Hide password" : "Show password"}
        title={isVisible ? "Hide password" : "Show password"}
        onClick={() => setIsVisible((currentValue) => !currentValue)}
      >
        <VisibilityIcon className="password-field__icon" aria-hidden="true" />
      </button>
    </div>
  );
};

export default PasswordField;
