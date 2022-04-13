import { 
  TbxElement, 
  TbxElementTitle, 
} from "./types/tbxElements"
import * as dataCategories from "./data/dataCategoryConfigs";
import jwtDecode from 'jwt-decode';
import { AuthToken, Role } from "./types/auth";

export const downloadFile = (
  { 
    data, 
    fileName, 
    fileType 
  }:
  {
   data: string
   fileName: string,
   fileType: string
  }
) => {
  const blob = new Blob([data], { type: fileType })
  const a = document.createElement('a')
  a.download = fileName
  a.href = window.URL.createObjectURL(blob)
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  a.dispatchEvent(clickEvt)
  a.remove()
}

export const reloadPage = () => {
  window.location.reload();
}

export const tbxEntityTypeToHeading = (type: TbxElement) => {
  switch(type) {
    case TbxElement.Admin:
      return TbxElementTitle.Admin
     
    case TbxElement.AdminGrp:
      return TbxElementTitle.AdminGrp

    case TbxElement.Descrip:
      return TbxElementTitle.Descrip

    case TbxElement.DescripGrp:
      return TbxElementTitle.DescripGrp

    case TbxElement.Transac:
      return TbxElementTitle.Transac

    case TbxElement.TransacGrp:
      return TbxElementTitle.TransacGrp
    
    case TbxElement.Note:
      return TbxElementTitle.Note

    case TbxElement.AdminNote:
      return TbxElementTitle.AdminNote

    case TbxElement.DescripNote:
      return TbxElementTitle.DescripNote

    case TbxElement.TransacNote:
      return TbxElementTitle.TransacNote

    case TbxElement.Ref:
      return TbxElementTitle.Ref

    case TbxElement.Xref:
      return TbxElementTitle.Xref
   
    case TbxElement.LangSec:
      return TbxElementTitle.LangSec

    case TbxElement.Term:
      return TbxElementTitle.Term
    
    case TbxElement.ConceptEntry:
      return TbxElementTitle.ConceptEntry;

    case TbxElement.Date:
      return TbxElementTitle.Date

    case TbxElement.TermNote:
      return TbxElementTitle.TermNote

    case TbxElement.TermNoteGrp:
      return TbxElementTitle.TermNoteGrp

    case TbxElement.Tbx:
      return TbxElementTitle.Tbx
  }
}

export const mapTbxElementToDataCategories = (
  tbxElement: TbxElement
) => {
  switch(tbxElement) {
    case TbxElement.TermNote:
      return dataCategories.termNoteDataCategories;

    case TbxElement.TermNoteGrp:
      return dataCategories.termNoteDataCategories;

    case TbxElement.Admin:
      return dataCategories.adminDataCategories;

    case TbxElement.AdminGrp:
      return dataCategories.adminDataCategories;

    case TbxElement.Descrip:
      return dataCategories.descripDataCategories;
    
    case TbxElement.DescripGrp:
      return dataCategories.descripDataCategories;

    case TbxElement.Transac:
      return dataCategories.transacDataCategories;

    case TbxElement.TransacGrp:
      return dataCategories.transacDataCategories;

    case TbxElement.Xref:
      return dataCategories.xrefDataCategories;

    case TbxElement.Ref:
      return dataCategories.refDataCategories;

    case TbxElement.TransacNote:
      return dataCategories.transacNoteDataCategories;

    default:
      return null
  }
}

export const mapRoleIdToName = (
  role: Role
) => {
  switch(role) {
    case Role.Admin:
      return "Admin";

    case Role.Staff:
      return "Staff";

    case Role.User:
      return "User";

    case Role.Inactive:
      return "Inactive";

    default:
      return "Inactive"
  }
}

export const getCookie = (name: string) => {
  const cookieArr = document.cookie.split(';');

  for (let i = 0; i < cookieArr.length; ++i) {
    const cookiePair = cookieArr[i].split('=');

    if (name === cookiePair[0].trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}

export const getAuthToken = (): null | AuthToken => {
  const token = getCookie('TRG_AUTH_TOKEN');
  if (token !== null) {
    return jwtDecode(token) as AuthToken;
  }

  return token;
}

export const isAuthorized = (
  desiredPrivilege: "READ" | "WRITE" | "DELETE" | "READ SENSITIVE",
  role: Role,
) => {
  switch(desiredPrivilege) {
    case "READ":
      return [
        Role.User, 
        Role.Admin, 
        Role.Staff
      ].includes(role)

    case "WRITE":
      return [
        Role.Admin, 
        Role.Staff
      ].includes(role)

    case "READ SENSITIVE":
      return [
        Role.Admin, 
        Role.Staff
      ].includes(role)

    case "DELETE":
      return [
        Role.Admin
      ].includes(role)
  }
}

