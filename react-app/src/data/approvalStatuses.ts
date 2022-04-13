import { GenericObject } from "../types";

export const APPROVAL_STATUS_CODES: GenericObject = {
  "preferredTerm-admn-sts": "Preferred",
  "admittedTerm-admn-sts": "Admitted",
  "deprecatedTerm-admn-sts": "Deprecated",
  "supersededTerm-admn-sts": "Superseded",  
};

export const APPROVAL_STATUSES: GenericObject = {
  "Preferred": "preferredTerm-admn-sts",
  "Admitted": "admittedTerm-admn-sts",
  "Deprecated": "deprecatedTerm-admn-sts",
  "Superseded": "supersededTerm-admn-sts",
}