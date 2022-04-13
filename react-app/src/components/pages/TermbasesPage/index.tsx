import React, { 
  useEffect, 
  useState 
} from 'react';
import { getTermbases } from "../../../services/api/baseterm";
import LoadingSpinner from "../../LoadingSpinner";
import { Termbase } from "../../../types/tbxElements";
import Table from "../../Table";
import './index.css';
import { LANGUAGE_CODE_MAP } from '../../../data/languages';
import { NotificationManager } from 'react-notifications';
import Pagination from 'react-responsive-pagination';

const TermbasesPage: React.FC = () => {
  const [termbases, setTermbases] = useState<Termbase[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  // Table data
  const tableHeaders = [
    'Name',
    'Language'
  ];

  const tableRows = termbases.map((termbase) => ([
    <a href={`/termbase/${termbase.termbaseUUID}`}>
      {
        termbase.name
      }
    </a>,
    LANGUAGE_CODE_MAP[termbase.xmlLang]?.[0] || ""
  ]));

  const handleGetTermbases = () => {
    return getTermbases({
      page,
      onInit: () => setLoading(true),
      onError: (errorMessage: string) => NotificationManager.error(errorMessage),
      onFinish: () => setLoading(false),
      onSuccess: (
        termbases,
        pageCount
      ) => {
        setTermbases(termbases);
        setPageCount(pageCount);
      }
    })
  }

  useEffect(() => {
    handleGetTermbases();
  }, [page]);

  return (
    <main className="termbases-page">
      <LoadingSpinner show={loading} />
      <h2 className="termbases-page__heading">Termbases</h2>
      <div className="termbases-page__button-wrapper">
        <Pagination
          total={pageCount}
          onPageChange={page => setPage(page)}
          current={page}
        />
      </div>
      <Table 
        headers={tableHeaders}
        rows={tableRows}
      />
    </main>
  )
}

export default TermbasesPage;