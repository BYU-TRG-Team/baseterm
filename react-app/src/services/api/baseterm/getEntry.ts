import { GetEntryEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";
import { GetEntryConfig } from "./types";

const getEntry = async (
  getEntryConfig: GetEntryConfig
) => {
  getEntryConfig.onInit();

  try {
    const response = (
      await requestHandler
        .get(`/termbase/${getEntryConfig.termbaseUUID}/entry/${getEntryConfig.uuid}`)
    ).data as GetEntryEndpointResponse;

    getEntryConfig.onSuccess(response);  
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while retrieving the concept entry."

    getEntryConfig.onError(errorMessage);
  } finally {
    getEntryConfig.onFinish();
  }
}

export default getEntry;