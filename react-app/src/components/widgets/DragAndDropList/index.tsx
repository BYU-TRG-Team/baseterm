import { PropsWithChildren, useState } from "react";
import { tbxEntityTypeToHeading } from "../../../utils";
import DragAndDrop from "react-list-drag-and-drop/lib/RLDD";
import { UUID } from "../../../types";
import "./index.css";
import { TbxElement } from "../../../types/tbxElements";
import { emptyStringDefault } from "../../../globals";

interface ListItem<ItemType> {
  data: ItemType,
  elementType: TbxElement,
  dataCategory?: string,
  id: number,
  value: string;
  onClick?: () => void
}

interface Props<ItemType> {
  list: ListItem<ItemType>[]
  onChange: (items: ListItem<ItemType>[]) => void,
  onAddItem?: () => void
  showAddItemButton?: boolean;
}

function DragAndDropList<ItemType extends {  
  value: string;
  uuid: UUID, 
  elementType: TbxElement,
}>({
  list,
  onChange,
  onAddItem = () => ({}),
  showAddItemButton = true
}: PropsWithChildren<Props<ItemType>>){

  return (
    <>
      <DragAndDrop
        cssClasses="drag-and-drop"
        items={list.map((item, index) => item)} 
        itemRenderer={(item: ListItem<ItemType>) => {
          return (
            <div className="drag-and-drop__item">
              <div className="drag-and-drop__header">
                <div className="drag-and-drop__text-bubble">
                  {
                    tbxEntityTypeToHeading(
                      item.data.elementType
                    )
                  }
                </div>
                {
                  item.dataCategory !== undefined &&
                  <div 
                    className="drag-and-drop__text-bubble drag-and-drop__text-bubble--orange drag-and-drop__text-bubble--lowercase"
                  >
                    { item.dataCategory }
                  </div>
                }
              </div>
              <p className="drag-and-drop__body">
                <button 
                  onClick={
                    item.onClick !== undefined ?
                    item.onClick :
                    () => {}
                  }
                  className="drag-and-drop__content"
                >
                  {
                    item.data.value.length === 0 ?
                      emptyStringDefault :
                      item.data.value
                  }
                </button>
              </p> 
            </div>
          )
        }}
        onChange={onChange}
      />
      {
        showAddItemButton &&
        (
          <div className="drag-and-drop__footer">
            <button 
              className="drag-and-drop__add-button"
              onClick={onAddItem}
            >
              +
            </button>
          </div>
        )
      }
    </>
  );
};

export default DragAndDropList;