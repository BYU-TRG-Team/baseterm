import { AdminStatusEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";
import { GetAdminStatusConfig } from "./types";

const getAdminStatus = async ({
  onSuccess = () => {},
  onInit = () => {},
  onError = () => {},
  onFinish = () => {},
}: GetAdminStatusConfig) => {
  onInit();

  try {
    const response = (
      await requestHandler.get("/auth/admin-status")
    ).data as AdminStatusEndpointResponse;

    onSuccess(response);
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.error !== undefined
        ? err.response?.data?.error
        : "There was a problem while checking account status.";

    onError(errorMessage);
  } finally {
    onFinish();
  }
};

export default getAdminStatus;
