import { LANGUAGE_CODE_MAP } from "../../../data/languages"
import { TermPreview } from "../../../types/tbxElements"
import { DropdownList } from "../../widgets/FilterWidget/types"

export const constructLanguage = (languageCode: string) => {
  if (languageCode.length === 0) return undefined;
  
  return LANGUAGE_CODE_MAP[languageCode].join('/')
}

export const constructTermList = ({
  termList,
  showLanguage = false,
  onClick,
}: {
  termList: TermPreview[],
  showLanguage?: boolean,
  onClick: (term: TermPreview) => void,
}) => {
  return (
    termList.length > 0 ?
    <>
      {
        termList
          .map((term) => { return (
            <div key={term.uuid}>
              <span>
                <button 
                  className="termbase-page__table-cell-button termbase-page__table-cell-button--inline"
                  onClick={() => onClick(term)}>
                    { term.value }
                </button>
                {
                  showLanguage && 
                  <span>
                    &nbsp;
                    {
                      `(${constructLanguage(term.language)})`
                    }
                  </span>
                }
              </span>
              <br />
            </div>
          )
              })
      }
    </> :
    null
  );
}

export const constructItemList = (itemList: string[]) => {
  return (
    itemList.length > 0 ?
    <>
      {
        itemList
          .map((item) => (
            <>
              <span>
                { item }
              </span>
              <br />
            </>
          )
        )
      }
    </> :
    null
  );
}

export const constructDropdownList = (
  values: string[], 
  labelConstructor: (val: string) => string = (val) => val,
): DropdownList => {
  return values.map((val: string) => ({
    value: val,
    label: labelConstructor(val),
  }))
};
