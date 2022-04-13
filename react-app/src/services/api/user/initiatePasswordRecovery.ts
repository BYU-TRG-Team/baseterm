import { InitiatePasswordRecoveryConfig } from "./types";
import requestHandler from "./requestHandler";

const initiatePasswordRecovery = async ({
  email,
  onInit = () => {},
  onError = () => {},
  onFinish = () => {},
}: InitiatePasswordRecoveryConfig ) => {
  onInit();

  try {
    const response = await requestHandler
      .post(`/auth/recovery`, {
        email
      });

    if (
      response.request.responseURL !== undefined
    ) {
      window.location.href = response.request.responseURL
    }
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.message !== undefined ?
      err.response?.data?.message :
      "There was a problem on the server while attempting to initiate password recovery."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default initiatePasswordRecovery;