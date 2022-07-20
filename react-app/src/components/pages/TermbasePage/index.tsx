/* eslint-disable react-hooks/exhaustive-deps */
import { 
  patchTermbase,
  deleteTermbase,
  getTermbaseTerms,
  getTermbase,
  postEntry,
  getTerm,
  getEntry,
  getLangSec
} from "../../../services/api/baseterm";
import { 
  TermPartialView,
  TermFullView,
  Termbase,
  TbxElement,
  ConceptEntry,
  LanguageSection,
  PersonRefObjectPreview
} from "../../../types/tbxElements"; 
import FilterWidget, { 
  DropdownList,
  Filters
} from '../../widgets/FilterWidget';
import {
  constructLanguage,
  constructItemList,
  constructDropdownList,
  constructTermList
} from './helpers';
import React, { 
  useEffect, 
  useState 
} from 'react';
import { useParams } from "react-router-dom";
import Table from "../../Table";
import Pagination from "../../widgets/Pagination";
import './index.css';
import LoadingSpinner from "../../LoadingSpinner";
import { LANGUAGE_CODE_MAP } from '../../../data/languages';
import { APPROVAL_STATUS_CODES } from '../../../data/approvalStatuses';
import { NotificationManager } from 'react-notifications';
import ExportWidgetComponent from '../../widgets/ExportWidget';
import EditTermbaseModal from '../../modals/EditTermbaseModal';
import AddEntryModal from "../../modals/AddEntryModal";
import TermModal from "../../modals/TermModal";
import DeleteWidget from "../../widgets/DeleteWidget";
import { useNavigate } from "react-router-dom";
import ConceptEntryModal from "../../modals/ConceptEntryModal";
import LanguageSectionModal from "../../modals/LanguageSectionModal";
import { emptyStringDefault } from "../../../globals";
import { UUID } from "../../../types";
import { getAuthToken, isAuthorized, tbxEntityTypeToHeading } from "../../../utils";
import AuthorizationWrapper from "../../AuthorizationWrapper";
import NewPersonRefObjectModal from "../../modals/NewPersonRefObjectModal";

const authToken = getAuthToken();

const TermbasePage: React.FC = () => {
  const termbaseUUID = useParams().termbaseUUID as string;
  const Navigator = useNavigate();
  const [termbase, setTermbase] = useState<null | Termbase>(null);
  const [personRefs, setPersonRefs] = useState<PersonRefObjectPreview[]>([]);

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState(0);

  // Term fetching state
  const [loading, setLoading] = useState(false);
  const [termList, setTermList] = useState<TermPartialView[]>([])

  // Term filtering state
  const [termFilter, setTermFilter] = useState<string>("");
  const [languageFilter, setLanguageFilter] = useState<string>("");
  const [languageDropdown, setLanguageDropdown] = useState<DropdownList>([]);
  const [subjectFieldFilter, setSubjectFieldFilter] = useState<string>("");
  const [subjectFieldDropdown, setSubjectFieldDropdown] = useState<DropdownList>([]);
  const [partOfSpeechFilter, setPartOfSpeechFilter] = useState<string>("");
  const [partOfSpeechDropdown, setPartOfSpeechDropdown] = useState<DropdownList>([]);
  const [approvalFilter, setApprovalFilter] = useState<string>("");
  const [approvalDropdown, setApprovalDropdown] = useState<DropdownList>([]);
  const [customerFilter, setCustomerFilter] = useState<string>("");
  const [customerDropdown, setCustomerDropdown] = useState<DropdownList>([]);
  const [conceptIdFilter, setConceptIdFilter] = useState<string>("");
  const [conceptIdDropdown, setConceptIdDropdown] = useState<DropdownList>([]);

  // Modal states
  const [showEditTermbaseModal, setShowEditTermbaseModal] = useState<boolean>(false);
  const [showAddEntryModal, setShowAddEntryModal] = useState<boolean>(false);
  const [showPersonRefObjectModal, setShowPersonRefObjectModal] = useState<boolean>(false);
  const [selectedLanguageSection, setSelectedLanguageSection] = useState<LanguageSection | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<TermFullView | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<ConceptEntry | null>(null);

  // Handlers
  const clearModals = () => {
    setSelectedTerm(null);
    setSelectedEntry(null);
    setSelectedLanguageSection(null);
    setShowAddEntryModal(false);
    setShowEditTermbaseModal(false);
  }

  const handlePatchTermbase = ({
    name,
    type,
    enforceBasicDialect
  }: {
    name?: string,
    type?: string,
    enforceBasicDialect?: boolean,
  }) => {

    return patchTermbase({
      name,
      type,
      uuid: termbaseUUID,
      enforceBasicDialect,
      onInit: () => setLoading(true),
      onError: (errorMessage: string) => {
        NotificationManager.error(errorMessage);
      },
      onFinish: () => setLoading(false),
      onSuccess: (updatedTermbase: Termbase) => {
        setTermbase(updatedTermbase)
        NotificationManager.success(
          "Termbase successfully updated."
        )
      }
    });
  }

  const handleAddEntryModalSubmit = (
    entryId: string,
    initialLanguageSection: string,
    initialTerm: string,
  ) => {

    return postEntry({
      entryId,
      initialLanguageSection,
      initialTerm,
      termbaseUUID,
      onInit: () => setLoading(true),
      onError: (errorMessage: string) => NotificationManager.error(errorMessage),
      onFinish: () => setLoading(false),
      onSuccess: () => {
        NotificationManager.success(
          "New concept entry successfully created."
        );
        handleGetTermbase();
        handleGetTermbaseTerms();
        clearModals();
      }
    });
  }

  const handleGetConceptEntry = (
    conceptEntryUUID: UUID
  ) => {
    return getEntry({
      uuid: conceptEntryUUID,
      termbaseUUID,
      onInit: () => ({}),
      onError: (errorMessage: string) => {
        NotificationManager.error(errorMessage);
      },
      onFinish: () => ({}),
      onSuccess: (conceptEntry) => {
        setSelectedEntry(conceptEntry);
      }
    })
  }

  const handleGetLanguageSection = (
    langSecUUID: UUID
  ) => {
    return getLangSec({
      uuid: langSecUUID,
      termbaseUUID,
      onInit: () => ({}),
      onError: (errorMessage: string) => {
        NotificationManager.error(errorMessage);
      },
      onFinish: () => ({}),
      onSuccess: (langSec) => {
        setSelectedLanguageSection(langSec);
      }
    })
  }

  const handleGetTerm = (termUUID: UUID) => {
    return getTerm({
      termbaseUUID,
      uuid: termUUID,
      onInit: () => setLoading(true),
      onError: (errorMessage: string) => {
        NotificationManager.error(errorMessage);
      },
      onFinish: () => setLoading(false),
      onSuccess: (term) => {
        setSelectedTerm(term);
      }
    });
  }

  const handleDeleteTermbase = () => {
    return deleteTermbase({
      uuid: termbaseUUID,
      onInit: () => setLoading(true),
      onError: (errorMessage) => NotificationManager.error(errorMessage),
      onFinish: () => setLoading(false),
    })
  };

  const handleGetTermbaseTerms = () => {
    return getTermbaseTerms({
      uuid: termbaseUUID,
      filters: {
        page,
        term: termFilter,
        part_of_speech: partOfSpeechFilter,
        customer: customerFilter,
        concept_id: conceptIdFilter,
        language: languageFilter,
        approval_status: approvalFilter,
        subject_field: subjectFieldFilter,
      },
      onInit: () => setLoading(true),
      onError: (errorMessage: string) => NotificationManager.error(errorMessage),
      onFinish: () => setLoading(false),
      onSuccess: (
        terms,
        pageCount
      ) => {
        setTermList(terms);
        setPageCount(pageCount)
      }
    })
  }

  const handleGetTermbase = async () => {
    return getTermbase({
      uuid: termbaseUUID,
      onInit: () => setLoading(true),
      onError: (errorMessage: string) => NotificationManager.error(errorMessage),
      onFinish: () => setLoading(false),
      onSuccess: (
        languages,
        subjectFields,
        partsOfSpeech,
        approvalStatuses,
        customers,
        conceptIds,
        personRefs,
        termbase
      ) => {
        setLanguageDropdown(
          constructDropdownList(
            languages,
            (language) => LANGUAGE_CODE_MAP[language][0]
          )
        );
        setSubjectFieldDropdown(
          constructDropdownList(subjectFields)
        );
        setPartOfSpeechDropdown(
          constructDropdownList(partsOfSpeech)
        );
        setApprovalDropdown(
          constructDropdownList(
            approvalStatuses,
            (approvalStatus) => APPROVAL_STATUS_CODES[approvalStatus],
          )
        );
        setCustomerDropdown(
          constructDropdownList(customers)
        );
        setConceptIdDropdown(
          constructDropdownList(conceptIds)
        );
        setPersonRefs(personRefs)
        setTermbase(termbase);
      }
    })
  }

  // Table data
  const tableHeaders = [
    'Term',
    'Language',
    'Synonyms',
    'Translations',
    'Subject Field',
    'Part of Speech',
    'Approval Status',
    'Customers',
    'Entry ID',
  ];

  const tableRows = termList.map((term) => [
    <button 
      className="termbase-page__table-cell-button"
      onClick={() => handleGetTerm(term.uuid)}>
     { term.value || emptyStringDefault }
    </button>,
    constructLanguage(term.language) || emptyStringDefault,
    term.synonyms.length ? 
      constructTermList({
        termList: term.synonyms,
        onClick: (term) => handleGetTerm(term.uuid),
      }) :
      emptyStringDefault,
    term.translations.length ?
      constructTermList({
        termList: term.translations,
        showLanguage: true,
        onClick: (term) => handleGetTerm(term.uuid)
      }) :
      emptyStringDefault,
    term.subjectField || emptyStringDefault,
    term.partOfSpeech || emptyStringDefault,
    APPROVAL_STATUS_CODES[term.approvalStatus] || emptyStringDefault,
    term.customers.length ?
      constructItemList(term.customers) :
      emptyStringDefault
    , 
    term.conceptId || emptyStringDefault,
  ]);

  // Filtering Logic
  const filterHandlers = {
    term: (e: React.ChangeEvent<HTMLInputElement>) => {
      setTermFilter(e.target.value);
      setPage(1);
    },
    language: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLanguageFilter(e.target.value);
      setPage(1);
    },
    partOfSpeech: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPartOfSpeechFilter(e.target.value);
      setPage(1);
    },
    customer: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCustomerFilter(e.target.value);
      setPage(1);
    },
    conceptId: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setConceptIdFilter(e.target.value);
      setPage(1);
    },
    approval: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setApprovalFilter(e.target.value);
      setPage(1);
    },
    subjectField: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSubjectFieldFilter(e.target.value);
      setPage(1);
    },
  }

  const clearAllFilters = () => {
    setTermFilter("");
    setLanguageFilter("");
    setSubjectFieldFilter("");
    setPartOfSpeechFilter("");
    setApprovalFilter("");
    setCustomerFilter("");
    setConceptIdFilter("");
  }

  const filters: Filters = [
    {
      type: "input",
      props: {
        label: "Term",
        onChange: filterHandlers.term,
        value: termFilter,
      },
    },
    {
      type: "dropdown",
      props: {
        label: "Language",
        onChange: filterHandlers.language,
        dropdownList: languageDropdown,
        value: languageFilter,
      }
    },
    {
      type: "dropdown",
      props: {
        label: "Subject Field",
        onChange: filterHandlers.subjectField,
        dropdownList: subjectFieldDropdown,
        value: subjectFieldFilter,
      }
    },
    {
      type: "dropdown",
      props: {
        label: "Part of Speech",
        onChange: filterHandlers.partOfSpeech,
        dropdownList: partOfSpeechDropdown,
        value: partOfSpeechFilter,
      }
    },
    {
      type: "dropdown",
      props: {
        label: "Approval Status",
        onChange: filterHandlers.approval,
        dropdownList: approvalDropdown,
        value: approvalFilter,
      }
    },
    {
      type: "dropdown",
      props: {
        label: "Customer",
        onChange: filterHandlers.customer,
        dropdownList: customerDropdown,
        value: customerFilter,
      }
    },
    {
      type: "dropdown",
      props: {
        label: "Entry ID",
        onChange: filterHandlers.conceptId,
        dropdownList: conceptIdDropdown,
        value: conceptIdFilter,
      }
    }
  ];

  // Components
  const ExportWidget = () => (
    termbase !== null ?
    <ExportWidgetComponent 
      termbase={termbase}
    /> :
    null
  );

  useEffect(
    () => {
      handleGetTermbaseTerms();
    }, 
    [
      page,
      termFilter,
      subjectFieldFilter,
      partOfSpeechFilter,
      approvalFilter,
      customerFilter,
      conceptIdFilter,
      languageFilter,
    ]
  );

  useEffect(
    () => {
      handleGetTermbase()
    },
    []
  );

  useEffect(
    () => {
      if (
        authToken !== null &&
        isAuthorized(
          "WRITE"
          
          ,
          authToken?.role
        )
      ) {
        const personRefObjectReference = 
          personRefs.filter((personRef) => personRef.id === authToken.id)[0];

        setShowPersonRefObjectModal(
          personRefObjectReference === undefined
        )
      }
    }, [
      termbase
    ]
  )

  if (authToken === null) return <></>;

  if (termbase === null) {
    return <LoadingSpinner show={true} />
  }

  return (
    <main className="termbase-page">   
      <LoadingSpinner show={loading} />
      {
        selectedTerm !== null &&
        <TermModal 
          onClose={() => setSelectedTerm(null)}
          isOpen={true}
          data={selectedTerm}
          handleGetConceptEntry={(conceptEntryUUID) => {
            clearModals();
            handleGetConceptEntry(conceptEntryUUID);
          }}
          handleGetLanguageSection={(langSecUUID) => {
            clearModals();
            handleGetLanguageSection(langSecUUID);
          }}
          onDelete={() => {
            handleGetTermbase();
            handleGetTermbaseTerms();
          }}
          onUpdate={async () => {
            await handleGetTermbase();
            await handleGetTermbaseTerms();
            await handleGetTerm(selectedTerm.uuid);
          }}
          enforceTbxBasic={termbase.enforceBasicDialect}
        />
      }
      {
        showPersonRefObjectModal &&
        <NewPersonRefObjectModal 
          onClose={() => {}}
          isOpen={true}
          data={{
            termbaseUUID,
          }}
          onSubmit={handleGetTermbase}
        />
      }
      {
        selectedEntry !== null &&
        <ConceptEntryModal 
          onClose={() => setSelectedEntry(null)}
          isOpen={true}
          data={selectedEntry}
          handleGetLanguageSection={(langSecUUID) => {
            clearModals();
            handleGetLanguageSection(langSecUUID);
          }}
          onUpdate={async () => {
            await handleGetTermbase();
            await handleGetTermbaseTerms();
            await handleGetConceptEntry(selectedEntry.uuid);
          }}
          onDelete={() => {
            handleGetTermbase();
            handleGetTermbaseTerms();
          }}
          enforceTbxBasic={termbase.enforceBasicDialect}
        />
      }
      {
        selectedLanguageSection !== null &&
        <LanguageSectionModal 
          onClose={() => setSelectedLanguageSection(null)}
          isOpen={true}
          data={selectedLanguageSection}
          handleGetConceptEntry={(conceptEntryUUID) => {
            clearModals();
            handleGetConceptEntry(conceptEntryUUID);
          }}
          handleGetTerm={(termUUID) => {
            clearModals();
            handleGetTerm(termUUID);
          }}
          onDelete={() => {
            handleGetTermbase();
            handleGetTermbaseTerms();
          }}
          enforceTbxBasic={termbase.enforceBasicDialect}
          onUpdate={async () => {
            await handleGetTermbase();
            await handleGetTermbaseTerms();
            await handleGetLanguageSection(selectedLanguageSection.uuid);
          }}
        />
      }
      {
        showEditTermbaseModal &&
        <EditTermbaseModal 
          isOpen={true}
          onClose={() => {
            setShowEditTermbaseModal(false);
          }}
          data={termbase}
          onSubmit={handlePatchTermbase}
        />
      }
      {
        showAddEntryModal &&
        <AddEntryModal 
          isOpen={true}
          onClose={() => { 
            setShowAddEntryModal(false)
          }}
          data={termbase}
          onSave={handleAddEntryModalSubmit}
        />
      }
      <header className="termbase-page__header">
        <h2 className="termbase-page__heading">{ termbase?.name }</h2>  
        <button 
          type="button"
          className="termbase-page__settings-button"
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            setShowEditTermbaseModal(true);
          }}
        >
          &#9881;
        </button> 
      </header>
      <div className="termbase-page__button-wrapper">
        <AuthorizationWrapper
          desiredPrivilege="WRITE"
          role={authToken.role}
        >
          <button
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowAddEntryModal(true);
            }}
          >
            Add New Entry
          </button>
        </AuthorizationWrapper>
        <AuthorizationWrapper
          desiredPrivilege="DELETE"
          role={authToken.role}
        >
          <DeleteWidget 
            handleDelete={async () => {
              try {
                await handleDeleteTermbase();
              } finally {
                Navigator("../termbases");
              }
            }}
            resourceName={
              tbxEntityTypeToHeading(TbxElement.Tbx)
            }
          />
        </AuthorizationWrapper>
        <AuthorizationWrapper
          desiredPrivilege="READ SENSITIVE"
          role={authToken.role}
        >
          <ExportWidget />
        </AuthorizationWrapper>
      </div>
      <div className="termbase-page__widget-wrapper">
        <FilterWidget 
          filters={filters}
          clearAll={clearAllFilters}
        />
        <Pagination 
          page={page}
          pageCount={pageCount}
          onChange={(page) => setPage(page)}
        />
      </div>
      <Table 
        headers={tableHeaders}
        rows={tableRows}
      />
    </main>
  )
}

export default TermbasePage;