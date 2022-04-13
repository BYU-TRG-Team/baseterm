import { 
  initializeSessionEventSource,
  handleSessionResponse,
 } from "../../../services/api/baseterm/SessionSSE";
import React, { 
  useEffect, 
  useState 
} from "react";
import { exportTermbase } from "../../../services/api/baseterm";
import { SessionSSEEndpointResponse } from "../../../types/responses";
import { Termbase } from "../../../types/tbxElements";
import { SpinnerCircular } from 'spinners-react';
import './index.css';
import { 
  SessionStatus, 
  SessionType 
} from "../../../types/sessions";
import { NotificationManager } from 'react-notifications';
import LoadingSpinner from '../../LoadingSpinner';

interface Props {
  termbase: Termbase;
}

const ExportWidget: React.FC<Props> = ({
  termbase,
}) => {
  const [loading, setLoading] = useState(false);
  const [sessionResponse, setSessionResponse] = useState<null | SessionSSEEndpointResponse>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({
    inProgress: false,
    isCompleted: false,
    summary: "",
  });
  
  const handleSubmit = async () => {
    return exportTermbase({
      uuid: termbase.termbaseUUID,
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
      SessionType.Export,
      termbase.name,
    )
  }, [sessionResponse])

  return (
    <div className="export-widget">
      <LoadingSpinner show={loading} />
      <button 
        onClick={handleSubmit}
        className="export-widget__form-input"
        disabled={sessionStatus.inProgress || sessionStatus.isCompleted}
      >
        Export
      </button>  
      <span>
        { sessionStatus.summary }
      </span>
      <SpinnerCircular 
        enabled={sessionStatus.inProgress} 
        style={{height: "22px"}}
        color="blue"
      />
    </div>
  )
}

export default ExportWidget;