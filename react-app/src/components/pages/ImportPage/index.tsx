import { 
  initializeSessionEventSource,
  handleSessionResponse,
  initialSessionState
 } from "../../../services/api/baseterm/SessionSSE";
import React, { 
  useEffect, 
  useRef, 
  useState 
} from "react";
import { reloadPage } from "../../../utils";
import { importTermbase } from "../../../services/api/baseterm";
import { SessionSSEEndpointResponse } from "../../../types/responses";
import { 
  SessionStatus, 
  SessionType 
} from "../../../types/sessions";
import { SpinnerCircular } from 'spinners-react';
import { NotificationManager } from 'react-notifications';
import LoadingSpinner from "../../LoadingSpinner";
import './index.css';

const ImportPage: React.FC = () => {
  const tbxFileRef = useRef<null | HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [tbxFile, setTbxFile ] = useState<null | File>(null);
  const [name, setName] = useState<null | string>(null);
  const [sessionResponse, setSessionResponse] = useState<null | SessionSSEEndpointResponse>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(initialSessionState);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (tbxFile === null || name === null) return; 

    return importTermbase({
      tbxFile,
      name,
      onError: (errorMessage) =>  NotificationManager.error(errorMessage),
      onFinish: () => setLoading(false),
      onInit: () => setLoading(true),
      onSuccess: (response) => {
        initializeSessionEventSource(
          response.sessionId || "",
          setSessionResponse,
        );
      }
    })
  };

  useEffect(() => {
    if (sessionResponse === null) return;
    handleSessionResponse(
      sessionResponse,
      sessionStatus,
      setSessionStatus,
      SessionType.Import
    )
  }, [sessionResponse])

  return (
    <main className="import-page">
      <LoadingSpinner show={loading} />
      Import a termbase from a TBX file (ISO 30042).
      <br />
      <br />
      <form onSubmit={handleSubmit} className="import-page__form">
        <div className="import-page__form-group">
          <label htmlFor="name">Base Name*:</label>&nbsp;
          <input
            type="text"
            required
            id="name"
            onChange={(event) => {
              setName(event.target.value);
            }}
            disabled={sessionStatus.inProgress || sessionStatus.isCompleted}
          />
        </div>
        <input 
          type="file" 
          ref={tbxFileRef} 
          required
          onChange={(event) => { 
            if (event.target.files) {
              setTbxFile(event.target.files[0])
            }
          }}
          className="import-page__form-group import-page__form-input"
          disabled={sessionStatus.inProgress || sessionStatus.isCompleted}
        />
        <div 
          style={{
            display: "flex", 
            alignItems: "center"
          }}
          className="import-page__form-group"
        >
          <input 
            type="submit"
            value="Import"
            className="import-page__form-input"
            disabled={sessionStatus.inProgress || sessionStatus.isCompleted}
          />
          <SpinnerCircular 
            enabled={sessionStatus.inProgress} 
            style={{height: "30px"}}
            color="blue"
          />
        </div>
      </form>
      <p>
        { sessionStatus.summary }
      </p>
      <p>
        {
          sessionStatus.isCompleted &&
          <button 
            onClick={reloadPage}
            className="import-page__form-input"  
          >
            Import New Termbase
          </button>
        }
      </p>
    </main>
  )
}

export default ImportPage;