import { SignUpConfig } from "./types";
import requestHandler from "./requestHandler";

const signUp = async ({
  username,
  password,
  email,
  name,
  onInit = () => {},
  onSuccess = () => {},
  onError = () => {},
  onFinish = () => {},
}: SignUpConfig ) => {
  onInit();

  try {
    await requestHandler
      .post(`/auth/signup`, {
        username,
        password,
        email,
        name
      })

   onSuccess();
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.message !== undefined ?
      err.response?.data?.message :
      "There was a problem on the server while attempting to sign in."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default signUp;