import { GetTermEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";
import { GetTermConfig } from "./types";

const getTerm = async (
  getTermConfig: GetTermConfig
) => {
  getTermConfig.onInit();

  try {
    const response = (
      await requestHandler
        .get(`/termbase/${getTermConfig.termbaseUUID}/term/${getTermConfig.uuid}`)
    ).data as GetTermEndpointResponse;

    getTermConfig.onSuccess(response);  
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while retrieving the term."

    getTermConfig.onError(errorMessage);
  } finally {
    getTermConfig.onFinish();
  }
}

export default getTerm;