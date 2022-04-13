import { LogoutConfig } from "./types";
import requestHandler from "./requestHandler";

const logout = async ({
  onInit = () => {},
  onSuccess = () => {},
  onError = () => {},
  onFinish = () => {},
}: LogoutConfig ) => {
  onInit();

  try {
    await requestHandler
      .get(`/auth/logout`)

   onSuccess();
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.message !== undefined ?
      err.response?.data?.message :
      "There was a problem on the server while attempting to logout."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default logout;