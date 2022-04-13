import React from 'react';
import Collapsible from 'react-collapsible';
import FilterIcon from './FilterIcon';
import './index.css';
import {
  InputProps,
  DropdownProps,
  Props,
} from './types';

const FilterButton: React.FC = () => (
 <button className="filter-widget__button">
   <FilterIcon />
 </button>
)

const Input: React.FC<InputProps> = ({
  label,
  onChange,
  value
}) => {
  const labelId = label.toLocaleLowerCase();
  
  return (
    <div>
      <label 
        htmlFor={labelId}
      >
        { `${label}: ` } 
      </label>
      <input 
        className="filter-widget__input"
        id={labelId}
        onChange={onChange}
        value={value}
      >
      </input>
    </div>
  )
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  onChange,
  dropdownList,
  value
}) => {
  const labelId = label.toLocaleLowerCase();
  
  return (
    <div>
      <label 
        htmlFor={labelId}
      >
        { `${label}: ` } 
      </label>
      <select 
        id={labelId}
        className="filter-widget__input"
        onChange={onChange}
        value={value}
      >
        <option value="">
        </option>
        {
          dropdownList.map((option, index) => (
            <option key={index} value={option.value}>
              { option.label }
            </option>
          ))
        }
      </select>
    </div>
  )
}
const FilterWidget: React.FC<Props> = ({ filters, clearAll }) => (
  <div className="filter-widget">
    <Collapsible 
      transitionTime={300}
      trigger={<FilterButton />}
    >
      <div className="filter-widget__content-container">
        <h2 className="filter-widget__content-container-heading">Filters</h2>
        {
          filters.map((filter, index) => (
            filter.type === "dropdown" ?
            <Dropdown {...filter.props} key={index}/> :
            <Input {...filter.props} key={index} />
          ))
        }
        <button onClick={clearAll}>Clear Filters</button>
      </div>
    </Collapsible>
  </div>
)

export default FilterWidget;
export * from './types';