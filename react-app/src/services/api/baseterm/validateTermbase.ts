import { ValidateTermbaseConfig } from "./types";
import { ValidationEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";

const validateTermbase = async (
  validateTermbaseConfig: ValidateTermbaseConfig,
) => {
  const formData = new FormData();
  formData.append('tbxFile', validateTermbaseConfig.tbxFile);

  validateTermbaseConfig.onInit();
  try {
    const response = (
      await requestHandler
      .post(`/validate`, formData)
    ).data as ValidationEndpointResponse;

    validateTermbaseConfig.onSuccess(response);

  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while validating the termbase."

    validateTermbaseConfig.onError(errorMessage);
  } finally {
    validateTermbaseConfig.onFinish();
  }
}

export default validateTermbase;