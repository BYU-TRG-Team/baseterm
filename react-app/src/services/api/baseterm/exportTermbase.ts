import { ExportEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";
import { ExportTermbaseConfig } from "./types";

const exportTermbase = async (
  exportTermbaseConfig: ExportTermbaseConfig
) => {
  exportTermbaseConfig.onInit();

  try {
    const response = (
      await requestHandler
        .get(`/export/${exportTermbaseConfig.uuid}`)
    ).data as ExportEndpointResponse

    exportTermbaseConfig.onSuccess(response);  
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while exporting the termbase."

    exportTermbaseConfig.onError(errorMessage);
  } finally {
    exportTermbaseConfig.onFinish();
  }
}

export default exportTermbase