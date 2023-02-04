import React from 'react';
import LanguageCodeService  from '@byu-trg/language-code-service';
import Select from 'react-select'
import "./index.css";
import EditableField from '../../EditableField';
import { NotificationManager } from "react-notifications";

interface Props {
  onChange: (langCode: string) => void;
  htmlId?: string;
  required?: boolean;
  disabled?: boolean;
  selectedLangCode?: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const LanguageWidget: React.FC<Props> = ({
  onChange,
  htmlId = "",
  required = true,
  disabled = false,
  selectedLangCode = "",
}) => {
  const languageCodeService = new LanguageCodeService()
  const selectOptions = languageCodeService.getAllLanguages().map(language => ({
    label: `${language.description} - ${language.tag}`,
    value: language.tag,
  }))
  const currentLanguage = languageCodeService.getLanguage(selectedLangCode)
  console.log(selectedLangCode)
  const parsedCurrentLanguageCode = languageCodeService.parseLangCode(selectedLangCode)
  console.log(parsedCurrentLanguageCode)
  const extendedSubTags = parsedCurrentLanguageCode?.extendedSubTags.join("-") || null

  return (
    <div id={htmlId} className="language-dropdown">
      <br />
      <strong>
        <label htmlFor="primarySubtag" className="language-dropdown__label">
          Primary Subtag
        </label>
      </strong>
      <Select<SelectOption> 
        options={selectOptions}
        required={required}
        isDisabled={disabled}
        value={
          currentLanguage !== null ? {
            label: `${currentLanguage.description} - ${currentLanguage.tag}`,
            value: currentLanguage.tag
          } : undefined
        }
        placeholder="Choose a subtag..."
        id="primarySubtag"
        name="primarySubtag"
        onChange={option => {
          if (option === null) return

          const updatedLangCode = option.value + (
            extendedSubTags !== null ?
            `-${extendedSubTags}` :
            ""
          )

          
          onChange(updatedLangCode)
        }}
      />
      <br />
      <EditableField
        labelClassName="language-dropdown__label"
        label="Extended Subtag(s)"
        value={extendedSubTags || ""}
        enableEditing={currentLanguage !== null && !disabled}
        onSave={async (extendedSubTags: string) => {
          if (!extendedSubTags) return

          const updatedLanguageCode = `${currentLanguage?.tag}-${extendedSubTags}`;
          const validationResult = languageCodeService.validateLangCode(updatedLanguageCode)

          if (!validationResult.OK) {
            NotificationManager.error(validationResult.error)
            return
          }

          onChange(updatedLanguageCode)
        }}
      />
    </div>
  )
};

export default LanguageWidget;