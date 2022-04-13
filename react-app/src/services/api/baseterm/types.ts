import { LangCode, UUID } from "../../../types";
import { 
  ExportEndpointResponse,
  ImportEndpointResponse, 
  ValidationEndpointResponse,
  PostEntryEndpointResponse,
  PostLangSecEndpointResponse,
  PatchTermEndpointResponse,
  PostTermEndpointResponse,
  PatchLangSecEndpointResponse,
  PostTermNoteEndpointResponse,
  PatchTermNoteEndpointResponse,
  PostAuxElementEndpointResponse,
  PatchAuxElementEndpointResponse,
  PostPersonRefObjectEndpointResponse,
} from "../../../types/responses";
import {
  TermPartialView,
  TermFullView,
  Termbase,
  ConceptEntry,
  LanguageSection,
  ConceptEntryPreview,
  TbxElement,
  PersonRefObjectPreview
} from "../../../types/tbxElements";

export interface PatchTermbaseConfig {
  uuid: string,
  name?: string,
  type?: string,
  enforceBasicDialect?: boolean;
  onInit: () => void;
  onError: (errorMessage: string) => void;
  onSuccess: (updatedTermbase: Termbase) => void;
  onFinish: () => void;
}

export interface DeleteTermbaseConfig {
  uuid: string,
  onInit: () => void;
  onError: (errorMessage: string) => void;
  onFinish: () => void;
}

export interface GetTermbaseTermsConfig {
  uuid: string,
  onInit: () => void;
  onError: (errorMessage: string) => void;
  onSuccess: (
    terms: TermPartialView[],
    pageCount: number,
  ) => void;
  onFinish: () => void;
  filters: {
    page: number,
    term: string,
    part_of_speech: string,
    customer: string,
    concept_id: string,
    language: string,
    approval_status: string,
    subject_field: string,
  }
}

export interface GetTermbaseConfig {
  uuid: string,
  onInit: () => void;
  onError: (errorMessage: string) => void;
  onSuccess: (
    languages: string[],
    subjectFields: string[],
    partsOfSpeech: string[],
    approvalStatuses: string[],
    customers: string[],
    conceptIds: string[],
    personRefs: PersonRefObjectPreview[],
    termbase: Termbase
  ) => void;
  onFinish: () => void;
}

export interface GetTermbasesConfig {
  page: number,
  onInit: () => void;
  onError: (errorMessage: string) => void;
  onSuccess: (
    termbases: Termbase[],
    pageCount: number,
  ) => void;
  onFinish: () => void;
}

export interface PostTermbaseConfig {
  name: string;
  language: string;
  description: string | null;
  onInit: () => void;
  onError: (errorMessage: string) => void;
  onSuccess: (termbaseUUID: UUID) => void;
  onFinish: () => void;
}

export interface ImportTermbaseConfig {
  name: string;
  tbxFile: File;
  onInit: () => void;
  onError: (errorMessage: string) => void;
  onSuccess: (response: ImportEndpointResponse) => void;
  onFinish: () => void;
}

export interface ValidateTermbaseConfig {
  tbxFile: File;
  onInit: () => void;
  onError: (errorMessage: string) => void;
  onSuccess: (response: ValidationEndpointResponse) => void;
  onFinish: () => void;
}

export interface ExportTermbaseConfig {
  uuid: string;
  onInit: () => void;
  onError: (errorMessage: string) => void;
  onSuccess: (response: ExportEndpointResponse) => void;
  onFinish: () => void;
}

export interface PostEntryConfig {
  termbaseUUID: string,
  entryId: string,
  initialLanguageSection: string,
  initialTerm: string,
  onInit: () => void;
  onError: (errorMessage: string) => void;
  onSuccess: (response: PostEntryEndpointResponse) => void;
  onFinish: () => void;
}

export interface GetTermConfig {
  uuid: string;
  termbaseUUID: string;
  onInit: () => void;
  onError: (errorMessage: string) => void;
  onSuccess: (response: TermFullView) => void;
  onFinish: () => void;
}

export interface GetEntryConfig {
  uuid: string;
  termbaseUUID: string;
  onInit: () => void;
  onError: (errorMessage: string) => void;
  onSuccess: (response: ConceptEntry) => void;
  onFinish: () => void;
}

export interface GetLanguageSectionConfig {
  uuid: string;
  termbaseUUID: string;
  onInit: () => void;
  onError: (errorMessage: string) => void;
  onSuccess: (response: LanguageSection) => void;
  onFinish: () => void;
}

export interface PatchEntryConfig {
  uuid: string;
  termbaseUUID: string;
  id?: string;
  onInit?: () => void;
  onError: (errorMessage: string) => void;
  onSuccess?: (response: ConceptEntryPreview) => void;
  onFinish?: () => void;
}

export interface PostLangSecConfig {
  termbaseUUID: UUID;
  entryUUID: UUID;
  langCode: LangCode;
  initialTerm: string;
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: PostLangSecEndpointResponse) => void;
  onFinish?: () => void
}

export interface DeleteEntryConfig {
  termbaseUUID: UUID;
  uuid: string;
  onInit: () => void,
  onError: (errorMessage: string) => void;
  onFinish: () => void
}

export interface DeleteLangSecConfig {
  termbaseUUID: UUID;
  uuid: string;
  onInit: () => void,
  onError: (errorMessage: string) => void;
  onFinish: () => void
}

export interface DeleteTermConfig {
  termbaseUUID: UUID,
  uuid: string;
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onFinish?: () => void
}

export interface PostTermConfig {
  termbaseUUID: UUID,
  langSecUUID: UUID,
  value: string,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onFinish?: () => void,
  onSuccess?: (response: PostTermEndpointResponse) => void;
}

export interface PatchTermConfig {
  termbaseUUID: UUID,
  uuid: UUID,
  value?: string,
  id?: string;
  termSecId?: string;
  order?: number;
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: PatchTermEndpointResponse) => Promise<void>,
  onFinish?: () => void,
}

export interface PatchLangSecConfig {
  termbaseUUID: UUID;
  uuid: UUID;
  langCode?: string;
  order?: number;
  onInit? : () => void;
  onError: (errorMessage: string) => void;
  onSuccess?: (response: PatchLangSecEndpointResponse) => Promise<void>;
  onFinish?: () => void;
}

export interface PostTermNoteConfig {
  termbaseUUID: UUID;
  isGrp: boolean;
  type: string;
  value: string;
  termUUID: UUID;
  onInit?: () => void;
  onError: (errorMessage: string) => void;
  onSuccess?: (response: PostTermNoteEndpointResponse) => Promise<void>;
  onFinish?: () => void;
}

export interface PostAuxElementConfig {
  termbaseUUID: UUID;
  type?: string;
  target?: string;
  value: string;
  elementType: string;
  parentElementType: string;
  parentUUID: UUID;
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: PostAuxElementEndpointResponse) => Promise<void>;
  onFinish?: () => void;
}

export interface PatchTermNoteConfig {
  termbaseUUID: UUID;
  uuid: UUID;
  id?: string;
  type?: string;
  value?: string;
  grpId?: string;
  target?: string;
  datatype?: string;
  langCode?: string;
  order?: number;
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: PatchTermNoteEndpointResponse) => Promise<void>;
  onFinish?: () => void;
}

export interface PatchAuxElementConfig {
  termbaseUUID: UUID;
  uuid: UUID;
  id?: string;
  grpId?: string;
  order?: number;
  target?: string;
  langCode?: string;
  datatype?: string;
  type?: string;
  value?: string;
  elementType: TbxElement;
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: PatchAuxElementEndpointResponse) => Promise<void>;
  onFinish?: () => void;
}

export interface DeleteAuxElementConfig {
  termbaseUUID: UUID;
  uuid: UUID;
  elementType: TbxElement,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onFinish?: () => void;
}

export interface DeleteTermNoteConfig {
  termbaseUUID: UUID;
  uuid: UUID;
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onFinish?: () => void;
}

export interface PostPersonRefObjectConfig {
  name: string,
  email: string,
  role: string,
  id: UUID,
  termbaseUUID: UUID,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: PostPersonRefObjectEndpointResponse) => void;
  onFinish?: () => void;
}