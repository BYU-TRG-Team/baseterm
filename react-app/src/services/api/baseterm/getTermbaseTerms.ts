import { GetTermbaseTermsConfig } from "./types";
import { GetTermbaseTermsEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";

const getTermbaseTerms = async (
  getTermbaseTermsConfig: GetTermbaseTermsConfig,
) => {
  getTermbaseTermsConfig.onInit();

  try {
    const response = (
      await requestHandler
        .get(`/termbase/${getTermbaseTermsConfig.uuid}/terms`, {
          params: getTermbaseTermsConfig.filters
        })
      ).data as GetTermbaseTermsEndpointResponse;

   getTermbaseTermsConfig.onSuccess(
     response.terms,
     response.pagination.pageCount
   );
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while retrieving the termbase terms."

    getTermbaseTermsConfig.onError(errorMessage);
  } finally {
    getTermbaseTermsConfig.onFinish();
  }
}

export default getTermbaseTerms;