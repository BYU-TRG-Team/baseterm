export type DropdownList = {
  value: string;
  label: string;
}[];

export type Filters = 
  (
    {
      type: "input",
      props: InputProps,
    } |
    {
      type: "dropdown",
      props: DropdownProps
    }
  )[];

export interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface DropdownProps {
  dropdownList: DropdownList;
  label: string;
  value: string;
  onChange:  (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export interface Props {
  filters: Filters
  clearAll: () => void;
}