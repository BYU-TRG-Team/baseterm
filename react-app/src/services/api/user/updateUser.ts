import { UpdateUserEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";
import { UpdateUserConfig } from "./types";

const updateUser = async ({
  uuid,
  username,
  email,
  name,
  roleId,
  onSuccess = () => {},
  onInit = () => {},
  onError = () => {},
  onFinish = () => {},
}: UpdateUserConfig ) => {
  onInit();

  try {
    const response = (
      await requestHandler
        .patch(`/user/${uuid}`, {
          ...(username !== undefined && { username }),
          ...(email !== undefined && { email }),
          ...(name !== undefined && { name }),
          ...(roleId !== undefined && { roleId }),
        })    
    ).data as UpdateUserEndpointResponse;

    onSuccess(response);
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while attempting to update profile data. Please try again with a different username, email or name."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default updateUser;