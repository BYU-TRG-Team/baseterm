import { 
  Termbase, 
  TermPartialView,
  TermFullView,
  ConceptEntry,
  LanguageSection,
  ConceptEntryPreview,
  LanguageSectionPreview,
  TermNote,
  AuxElement,
  PersonRefObjectPreview,
} from "./tbxElements";
import { UUID, } from ".";
import { FileServiceSession } from "./sessions";
import { User } from "./auth";

// BaseTerm API

export interface PaginationResponse {
  page: number;
  perPage: number;
  pageCount: number;
  totalCount: number;
}

export interface ValidationEndpointResponse {
  tbx?: {[key:string]: any}
}

export interface ImportEndpointResponse {
  sessionId: UUID;
  termbaseUUID: UUID;
}

export interface ExportEndpointResponse {
  sessionId: UUID;
}

export interface PostTermbaseEndpointResponse {
  uuid: UUID,
}

export interface GetTermbasesEndpointResponse {
  termbases: Termbase[];
  pagination: PaginationResponse;
}

export interface SessionSSEEndpointResponse extends FileServiceSession {}

export interface GetTermbaseEndpointResponse extends Termbase {
  metadata: {
    languages: string[],
    partsOfSpeech: string[],
    customers: string[],
    conceptIds: string[],
    approvalStatuses: string[],
    subjectFields: string[],
    personRefs: PersonRefObjectPreview[]
  }
}

export interface GetTermbaseTermsEndpointResponse {
  pagination: PaginationResponse;
  terms: TermPartialView[];
}

export interface PostEntryEndpointResponse {
  uuid: UUID;
}

export interface PostLangSecEndpointResponse {
  uuid: UUID;
}

export interface PostTermbaseEndpointResponse {
  uuid: UUID;
}

export interface PostTermEndpointResponse {
  uuid: UUID;
}

export interface PostTermNoteEndpointResponse {
  uuid: UUID;
}

export interface PostAuxElementEndpointResponse {
  uuid: UUID;
}

export interface PostPersonRefObjectEndpointResponse {
  uuid: UUID;
}

export interface PatchTermNoteEndpointResponse extends TermNote {};

export interface GetTermEndpointResponse extends TermFullView {};

export interface PatchTermbaseEndpointReponse extends Termbase {};

export interface GetEntryEndpointResponse extends ConceptEntry {};

export interface GetLanguageSectionEndpointResponse extends LanguageSection {};

export interface PatchEntryEndpointReponse extends ConceptEntryPreview {};

export interface PatchTermEndpointResponse extends TermFullView {};

export interface PatchLangSecEndpointResponse extends LanguageSectionPreview {};

export interface PatchAuxElementEndpointResponse extends AuxElement {};

// User API

export interface SignInEndpointEndpointResponse {
  token: string;
}

export interface PasswordResetSubmitEndpointResponse {
  token: string;
}

export interface UpdateUserEndpointResponse {
  newToken: string;
}

export interface GetUserEndpointResponse {
  email: string;
  username: string;
  name: string;
}

export interface GetAllUsersEndpointResponse {
  users: User[];
}
