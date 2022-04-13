import { Role } from "../../types/auth";

const administrativeLinks = (
  <>
    <a 
      className="header__link header__link--default" 
      href="/user-management"
    >
      Users
    </a>
  </>
)

const writeLinks = (
  <>
    <a 
      className="header__link header__link--default" 
      href="/import"
    >
      Import
    </a>
    <a 
      className="header__link header__link--default" 
      href="/create"
    >
      Create
    </a>
  </>
);

const readLinks = (
  <>
    <a 
      className="header__link header__link--default" 
      href="/termbases"
    >
      Termbases
    </a>
  </>
);


export const getAuthorizedLinks = (
  role: Role
): JSX.Element => {
  switch(role) {
    case Role.Admin:
      return (
        <>
          { administrativeLinks }
          { readLinks }
          { writeLinks }
        </>
      )

    case Role.Staff:
      return (
        <>
          { readLinks }
          { writeLinks }
        </>
      )

    case Role.User:
      return readLinks
    
    default:
      return <></>
  }
}