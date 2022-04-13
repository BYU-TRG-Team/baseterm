import React from "react";
import { TbxElement } from '../../../types/tbxElements';
import { tbxEntityTypeToHeading } from '../../../utils';
import "./index.css";

interface Props {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  dataCategories: TbxElement[];
  htmlId?: string;
  required?: boolean;
}

const AuxElementDropdown: React.FC<Props> = ({
  onChange,
  htmlId = "",
  required = true,
  dataCategories
}) => {
  return (
    <select 
      id={htmlId}
      onChange={onChange}
      required={required}
      className="aux-element-dropdown"
    >
      <option   
        value="" 
        selected 
        disabled
      >
        Select an auxillary element...
      </option>
      {
       dataCategories.map((tbxElement) => {
          const tbxElementTitle = tbxEntityTypeToHeading(
            tbxElement
          );
        
          return (
            <option 
              key={tbxElement} 
              value={tbxElement}>
              { tbxElementTitle }
            </option>
          )
        })
      }
    </select>
  )
};

export default AuxElementDropdown;