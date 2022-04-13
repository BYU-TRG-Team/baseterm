import requestHandler from "./requestHandler";
import { DeleteUserConfig } from "./types";

const deleteUser = async ({
  uuid,
  onSuccess = () => {},
  onInit = () => {},
  onError = () => {},
  onFinish = () => {},
}: DeleteUserConfig ) => {
  onInit();

  try {
    await requestHandler
      .delete(`/user/${uuid}`)

    onSuccess();
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while attempting to delete the user."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default deleteUser;