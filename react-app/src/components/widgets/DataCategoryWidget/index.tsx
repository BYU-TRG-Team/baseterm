import React, { useEffect, useState } from "react";
import { TbxElement } from "../../../types/tbxElements";
import { DataCategory } from "../../../data/dataCategoryConfigs";
import "./index.css";

interface Props {
  onChange?: (type: string, value: string) => void,
  onSubmit?: (type: string, value: string) => void,
  isField?: boolean,
  tbxElement: TbxElement,
  dataCategories: DataCategory[],
  initialType: string,
  initialValue: string,
  enforceTbxBasic?: boolean,
  editingAuthorized?: boolean,
}

const DataCategoryWidget = ({
  onChange = () => {},
  isField = false,
  dataCategories,
  tbxElement,
  initialType,
  initialValue,
  onSubmit = () => {},
  enforceTbxBasic = true,
  editingAuthorized = true,
}: Props) => {
  const filteredDataCategories = dataCategories.filter(category => {
    return !category.constrainedLevels || category.levels.includes(tbxElement);
  });
  const retrieveCategory = (
    type: string,
  ): DataCategory | undefined => {
    return filteredDataCategories.filter(category => {
      return category.name === type
    })[0];
  };
  const [type, setType] = useState(initialType);
  const [value, setValue] = useState(initialValue);
  const [editable, setEditable] = useState(false);
  const category = retrieveCategory(type);
  const reset = () => {
    setType(initialType);
    setValue(initialValue);
  }

  const typeField = (
    <>
      <label
        htmlFor="type" 
        className="data-category-widget__input-label">
        Type:
      </label>
      <br />
      {
        !enforceTbxBasic &&
        <input 
          className="data-category-widget__input"
          required
          id="type"
          type="text"
          value={type}
          disabled={isField && !editable}
          onChange={(e) => {
            setType(e.target.value)
          }}
        />
      }
      {
        enforceTbxBasic &&
        <select 
          value={type}
          id="type"
          onChange={(e) => {
            setType(
              e.target.value
            );
            setValue(
              ""
            );
          }}
          required
          disabled={isField && !editable}
          className="data-category-widget__dropdown"
        >
          <option
            value=""
            selected
          >
            Select a type...
          </option>
          {
            filteredDataCategories.map((category) => (
              <option
                key={category.name}
                value={category.name}
              >
                { category.name }
              </option>
            ))
          }
        </select> 
      }
    </>
  );

  const valueField = (
    <>
      {
        enforceTbxBasic &&
        category !== undefined &&
        category.constrainedValues &&
        <>
          <label
            htmlFor="value"
            className="data-category-widget__input-label"
          >
            Value:
          </label>  
          <br />
          <select
            id="value"
            value={value}
            onChange={(e) => {
              setValue(
                e.target.value
              )
            }}
            required
            disabled={!editable && isField}
            className="data-category-widget__dropdown"
          >
            <option
              value=""
              selected
            >
              Select a value...
            </option>
            {
              category.values.map((value) => (
                <option 
                  key={value}
                  value={value}
                >
                  { value }
                </option>
              ))
            }
          </select>
        </>
      }
    {
      (
      !enforceTbxBasic ||
      (
        category !== undefined &&
        !category.constrainedValues
      )
      ) &&
      <>
        <label
          htmlFor="value"
          className="data-category-widget__input-label"
        >
          Value:
        </label> 
        <br />
        <textarea 
          className="data-category-widget__textarea"
          required
          disabled={!editable && isField}
          id="value"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      </>
    }
    </>
  )

  const inputFields = (
    <>
      { typeField }
      <br />
      <br />
      { valueField }
    </>
  )

  useEffect(() => {
    if (type !== undefined) {
      onChange(type, value);
    }
  }, [type, value]);

  if (isField) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(type, value);
          setEditable(false);
        }}
      >
        {
          !editable &&
          editingAuthorized &&
          <button
            onClick={(e) => {
              e.preventDefault();
              setEditable(true);
            }}
            className="data-category-widget__button"
          >
            &#9998;
          </button>
        }
        <br />
        <br />
        {
          inputFields
        }
        <br />
        <br />
        {
          editable &&
          <>
            <input 
              type="submit"
              className="data-category-widget__button"
            />
            <button
              className="data-category-widget__button"
              onClick={(e) => {
                e.preventDefault();
                reset();
                setEditable(false);
              }}
            >
              Cancel
            </button>
          </>
        }
      </form>
    )
  }

  return inputFields
}

export default DataCategoryWidget;