import { SubmitPasswordRecoveryConfig } from "./types";
import requestHandler from "./requestHandler";
import { PasswordResetSubmitEndpointResponse } from "../../../types/responses";

const submitPasswordRecovery = async ({
  password,
  token,
  onInit = () => {},
  onSuccess = () => {},
  onError = () => {},
  onFinish = () => {},
}: SubmitPasswordRecoveryConfig ) => {
  onInit();

  try {
    const response = (
      await requestHandler
        .post(`/auth/recovery/${token}`, {
          password
        })
    ).data as PasswordResetSubmitEndpointResponse;

    onSuccess(response);
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.message !== undefined ?
      err.response?.data?.message :
      "There was a problem on the server while attempting to reset your password."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default submitPasswordRecovery;