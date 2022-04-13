import React from 'react';
import { Role } from '../../../types/auth';
import { mapRoleIdToName } from '../../../utils';
import "./index.css";

interface Props {
  onChange: (role: Role) => void;
  htmlId?: string;
  selectedRole?: Role;
}

const roleIds = Object.values(Role).filter((val) => typeof val !== "string");

const RoleDropdown: React.FC<Props> = ({
  onChange,
  htmlId = "",
  selectedRole
}) => {
  return (
    <select 
      id={htmlId}
      onChange={(e) => {
        const role = Number(e.target.value) as Role;

        onChange(role);
      }}
      className="role-dropdown"
    >
      <option 
        value="" 
        selected={selectedRole === undefined}
      >
      </option>
      {
        roleIds.map(role => (
          <option 
            key={role} 
            selected={selectedRole === role}
            value={role}
          >
            { 
              mapRoleIdToName(
                role as Role
              ) 
            }
          </option>
        ))
      }
    </select>
  )
};

export default RoleDropdown;