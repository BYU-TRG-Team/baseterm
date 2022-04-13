import {
  UUID,
  NullableString
} from ".";

export enum TbxElement {
  Note = "note",
  Admin = "admin",
  AdminGrp = "adminGrp",
  AdminNote = "adminNote",
  Descrip = "descrip",
  DescripGrp = "descripGrp",
  DescripNote = "descripNote",
  Date = "date",
  Ref = "ref",
  Transac = "transac",
  TransacGrp = "transacGrp",
  TransacNote = "transacNote",
  Xref = "xref",
  ConceptEntry = "conceptEntry",
  LangSec = "langSec",
  Term = "term",
  TermNoteGrp = "termNoteGrp",
  TermNote = "termNote",
  Tbx = "tbx",
}

export type TbxAuxElement =
  Extract<
    TbxElement,
    TbxElement.Admin |
    TbxElement.AdminGrp |
    TbxElement.Descrip |
    TbxElement.DescripGrp |
    TbxElement.Transac |
    TbxElement.TransacGrp |
    TbxElement.Note |
    TbxElement.Ref |
    TbxElement.Xref |
    TbxElement.Date |
    TbxElement.AdminNote |
    TbxElement.DescripNote |
    TbxElement.TransacNote
  >;

export enum TbxElementTitle {
  Admin = "Admin",
  AdminGrp = "Admin Group",
  Descrip = "Descrip",
  DescripGrp = "Descrip Group",
  Transac = "Transac",
  TransacGrp = "Transac Group",
  Note = "Note",
  Ref = "Ref",
  Xref = "Xref",
  ConceptEntry = "Concept Entry",
  LangSec = "Language Section",
  Term = "Term",
  AdminNote = "Admin Note",
  DescripNote = "Descrip Note",
  TransacNote = "Transac Note",
  Date = "Date",
  TermNote = "Term Note",
  TermNoteGrp = "Term Note Group",
  Tbx = "tbx"
}

export interface Termbase {
  type: string;
  style: string;
  xmlns: string;
  name: string;
  termbaseUUID: UUID;
  xmlLang: string;
  enforceBasicDialect: boolean;
}

export interface ConceptEntryPreview {
  uuid: UUID;
  id: string;
  termbaseUUID: string;
}

export interface ConceptEntry {
  uuid: UUID;
  id: string;
  termbaseUUID: string;
  languageSections: LanguageSectionPreview[];
  auxElements: AuxElement[];
}

export interface LanguageSectionPreview {
  uuid: UUID;
  termbaseUUID: string;
  xmlLang: string;
}

export interface LanguageSection {
  conceptEntry: ConceptEntryPreview;
  uuid: UUID;
  xmlLang: string;  
  termbaseUUID: string;
  auxElements: AuxElement[];
  terms: TermPreview[];
}


export interface AuxElementPreview {
  uuid: UUID;
  value: string;
  elementType: TbxAuxElement,
}

export interface AuxElement extends AuxElementPreview {
  order: number;
  id: NullableString;
  grpId: NullableString;
  termbaseUUID: UUID;
  target?: NullableString;
  xmlLang?: NullableString;
  datatype?: NullableString;
  type?: NullableString;
  auxElements?: AuxElement[];
}

export interface TermNote {
  uuid: UUID;
  xmlLang: NullableString;
  target: NullableString;
  grpId: NullableString;
  id: NullableString;
  termbaseUUID: UUID;
  datatype: NullableString;
  type: string;
  value: string;
  order: number;
  auxElements?: AuxElement[]
  elementType: TbxElement.TermNote | TbxElement.TermNoteGrp
}

export interface TermPreview {
  uuid: UUID;
  termSecId: NullableString;
  id: NullableString;
  value: string;
  language: string;
  termbaseUUID: UUID;
}

export interface TermPartialView extends TermPreview {
  synonyms: TermPreview[];
  translations: TermPreview[];
  conceptId: string;
  customers: string[];
  partOfSpeech: string;
  approvalStatus: string; 
  subjectField: string;
}

export interface TermFullView extends TermPartialView {
  conceptEntry: ConceptEntryPreview;
  languageSection: LanguageSectionPreview;
  auxElements: AuxElement[];
  termNotes: TermNote[];
}

export interface PersonRefObjectPreview {
  uuid: UUID,
  id: string,
  source: "BaseTerm" | "External"
}
