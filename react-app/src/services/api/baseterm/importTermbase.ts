import { ImportEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";
import { ImportTermbaseConfig } from "./types";

const importTermbase = async (
  importTermbaseConfig: ImportTermbaseConfig,
) => {
  const formData = new FormData();
  formData.append('tbxFile', importTermbaseConfig.tbxFile);
  formData.append('name', importTermbaseConfig.name);

  importTermbaseConfig.onInit();
  try {
    const response = (
      await requestHandler
        .post(`/import`, formData)
    ).data as ImportEndpointResponse;

    importTermbaseConfig.onSuccess(response);

  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while importing the termbase."

    importTermbaseConfig.onError(errorMessage);
  } finally {
    importTermbaseConfig.onFinish();
  }
}

export default importTermbase;