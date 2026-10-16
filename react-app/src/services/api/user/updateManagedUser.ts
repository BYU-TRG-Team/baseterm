import { UpdateManagedUserEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";
import { UpdateManagedUserConfig } from "./types";

const updateManagedUser = async ({
  uuid,
  username,
  email,
  name,
  verified,
  roleId,
  onSuccess = () => {},
  onInit = () => {},
  onError = () => {},
  onFinish = () => {},
}: UpdateManagedUserConfig) => {
  onInit();

  try {
    const response = (
      await requestHandler.patch(`/admin/users/${uuid}`, {
        ...(username !== undefined && { username }),
        ...(email !== undefined && { email }),
        ...(name !== undefined && { name }),
        ...(verified !== undefined && { verified }),
        ...(roleId !== undefined && { roleId }),
      })
    ).data as UpdateManagedUserEndpointResponse;

    onSuccess(response);
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.error !== undefined
        ? err.response?.data?.error
        : "There was a problem while updating the user.";

    onError(errorMessage);
  } finally {
    onFinish();
  }
};

export default updateManagedUser;
