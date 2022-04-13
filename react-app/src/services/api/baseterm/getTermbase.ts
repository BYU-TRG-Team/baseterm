import { GetTermbaseEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";
import { GetTermbaseConfig } from "./types";

const getTermbase = async (
  getTermbaseConfig: GetTermbaseConfig
) => {
  getTermbaseConfig.onInit();

  try {
    const response = (
      await requestHandler
        .get(`/termbase/${getTermbaseConfig.uuid}`)
    ).data as GetTermbaseEndpointResponse;

    getTermbaseConfig.onSuccess(
      response.metadata.languages,
      response.metadata.subjectFields,
      response.metadata.partsOfSpeech,
      response.metadata.approvalStatuses,
      response.metadata.customers,
      response.metadata.conceptIds,
      response.metadata.personRefs,
      {
        type: response.type,
        style: response.style,
        xmlns: response.xmlns,
        name: response.name,
        termbaseUUID: response.termbaseUUID,
        xmlLang: response.xmlLang,
        enforceBasicDialect: response.enforceBasicDialect
      }
    )
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while retrieving the termbase."

    getTermbaseConfig.onError(errorMessage);
  } finally {
    getTermbaseConfig.onFinish();
  }
}

export default getTermbase