import React from 'react';
import { LANGUAGE_MAP } from "../../../data/languages";
import "./index.css";

interface Props {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  htmlId?: string;
  required?: boolean;
  disabled?: boolean;
  selectedLangCode?: string;
  nullable?: boolean;
}

const LanguageDropdown: React.FC<Props> = ({
  onChange,
  htmlId = "",
  required = true,
  disabled = false,
  selectedLangCode,
  nullable = false,
}) => {
  return (
    <select 
      id={htmlId}
      onChange={onChange}
      required={required}
      className="language-dropdown"
      disabled={disabled}
    >
      <option 
        value="" 
        selected={selectedLangCode === undefined} 
        disabled={!nullable}
      >
        {
          nullable ?
          "" :
          "Select a language..."
        }
      </option>
      {
        Object.keys(LANGUAGE_MAP).map(language => (
          <option 
            key={language} 
            selected={selectedLangCode === LANGUAGE_MAP[language][0]}
            value={LANGUAGE_MAP[language][0]}
          >
            { language }
          </option>
        ))
      }
    </select>
  )
};

export default LanguageDropdown;