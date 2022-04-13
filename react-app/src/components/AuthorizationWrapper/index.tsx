import React from "react";
import { Role } from "../../types/auth";
import { isAuthorized } from "../../utils";

interface Props {
  desiredPrivilege: "READ" | "WRITE" | "DELETE" | "READ SENSITIVE",
  role: Role,
  children: JSX.Element
}

const AuthorizationWrapper: React.FC<Props> = ({
  role,
  desiredPrivilege,
  children
}) => {

  if (
    !isAuthorized(
      desiredPrivilege,
      role,
    )
  ) return <></>;

  return children;
}

export default AuthorizationWrapper;