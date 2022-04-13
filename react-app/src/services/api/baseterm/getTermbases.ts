import { GetTermbasesEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";
import { GetTermbasesConfig } from "./types";

const getTermbases = async (
  getTermbasesConfig: GetTermbasesConfig
) => {
  getTermbasesConfig.onInit();

  try {
    const response = (
      await requestHandler
        .get(`/termbases`, {
          params: {
            page: getTermbasesConfig.page,
          }
        }) 
    ).data as GetTermbasesEndpointResponse;

    getTermbasesConfig.onSuccess(
      response.termbases,
      response.pagination.pageCount,
    );
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while retrieving the termbases."

    getTermbasesConfig.onError(errorMessage);
  } finally {
    getTermbasesConfig.onFinish();
  }
}

export default getTermbases;