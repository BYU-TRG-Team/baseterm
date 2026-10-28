import { CreateManagedUserEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";
import { CreateManagedUserConfig } from "./types";

const createManagedUser = async ({
  username,
  email,
  name,
  password,
  roleId,
  onSuccess = () => {},
  onInit = () => {},
  onError = () => {},
  onFinish = () => {},
}: CreateManagedUserConfig) => {
  onInit();

  try {
    const response = (
      await requestHandler.post("/admin/users", {
        username,
        email,
        name,
        password,
        roleId,
      })
    ).data as CreateManagedUserEndpointResponse;

    onSuccess(response);
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.error !== undefined
        ? err.response?.data?.error
        : "There was a problem while creating the user.";

    onError(errorMessage);
  } finally {
    onFinish();
  }
};

export default createManagedUser;
