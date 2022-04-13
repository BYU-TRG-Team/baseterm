import { fetchEventSource } from "@microsoft/fetch-event-source";
import { SessionSSEEndpointResponse } from "../../../../types/responses";
import { SessionStatus, SessionType } from "../../../../types/sessions";
import { NotificationManager } from "react-notifications";
import { downloadFile } from "../../../../utils";

export const initialSessionState = {
  inProgress: false,
  isCompleted: false,
  summary: "",
}

export const initializeSessionEventSource = (
  sessionId: string,
  setSessionResponse: React.Dispatch<React.SetStateAction<SessionSSEEndpointResponse | null>>,
) => (
  fetchEventSource(`/baseterm/session/${sessionId}`, {
    method: "GET",
    headers: {
      Accept: "text/event-stream",
    },
    openWhenHidden: true,
    onmessage(event) {
      const sessionResponse = JSON.parse(event.data) as SessionSSEEndpointResponse;
      setSessionResponse(sessionResponse);

      if (sessionResponse.error !== undefined) {
        throw new Error(sessionResponse.error);
      }

      if (sessionResponse.status === "completed") {
        throw new Error(sessionResponse.status);
      }
    },
    onerror(err: Error) {
      if (err.message !== "completed") {
        setSessionResponse({
          error: err.message
        });
      }

      throw new Error("Event source connection stopping");
    },
  })
);

export const handleSessionResponse = (
  sessionResponse: SessionSSEEndpointResponse,
  sessionStatus: SessionStatus,
  setSessionStatus: React.Dispatch<React.SetStateAction<SessionStatus>>,
  sessionType: SessionType,
  termbaseName?: string,
) => {

  const sessionTypeName = 
    sessionType === SessionType.Export ?
    "export" :
    "import"
    
  if (sessionResponse === null) {
    setSessionStatus({
      inProgress: false,
      isCompleted: false,
      summary: "",
    });

    return;
  }

  if (sessionResponse.error !== undefined) {
    setSessionStatus({
      inProgress: false,
      isCompleted: false,
      summary: "",
    });

    NotificationManager.error(sessionResponse.error);

    return;
  }

  if (sessionResponse?.status === "completed") {
    setSessionStatus({
      inProgress: false,
      isCompleted: true,
      summary: sessionStatus.summary,
    });

    sessionType === SessionType.Export && setTimeout(() => { 
      setSessionStatus(initialSessionState);
    }, 2500);

    NotificationManager.success(`TBX File successfully ${sessionTypeName}ed`);

    if (sessionType === SessionType.Export) {
      downloadFile({
        data: sessionResponse.data as string,
        fileName: `${termbaseName}.tbx`,
        fileType: "text/xml",
      });
    }

    return;
  }

  let summary = "";

  if (
    sessionResponse.conceptEntryCount && 
    sessionResponse.conceptEntryCount > 0
  ) {
    summary = `
      Entries ${sessionTypeName}ed (out of ${sessionResponse.conceptEntryCount}): ${sessionResponse.conceptEntryNumber}
    `;
  }

  setSessionStatus({
    inProgress: true,
    isCompleted: false,
    summary,
  })
}