import { GetLanguageSectionEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";
import { GetLanguageSectionConfig } from "./types";

const getLangSec = async (
  getLanguageSectionConfig: GetLanguageSectionConfig
) => {
  getLanguageSectionConfig.onInit();

  try {
    const response = (
      await requestHandler
        .get(`/termbase/${getLanguageSectionConfig.termbaseUUID}/langSec/${getLanguageSectionConfig.uuid}`)
    ).data as GetLanguageSectionEndpointResponse;

    getLanguageSectionConfig.onSuccess(response);  
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while retrieving the language section."

    getLanguageSectionConfig.onError(errorMessage);
  } finally {
    getLanguageSectionConfig.onFinish();
  }
}

export default getLangSec;