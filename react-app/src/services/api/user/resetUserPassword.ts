import { ResetUserPasswordEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";
import { ResetUserPasswordConfig } from "./types";

const resetUserPassword = async ({
  uuid,
  password,
  onSuccess = () => {},
  onInit = () => {},
  onError = () => {},
  onFinish = () => {},
}: ResetUserPasswordConfig) => {
  onInit();

  try {
    const response = (
      await requestHandler.patch(`/admin/users/${uuid}/password`, {
        password,
      })
    ).data as ResetUserPasswordEndpointResponse;

    onSuccess(response);
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.error !== undefined
        ? err.response?.data?.error
        : "There was a problem while updating the password.";

    onError(errorMessage);
  } finally {
    onFinish();
  }
};

export default resetUserPassword;
