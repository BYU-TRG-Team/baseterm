import { SignInConfig } from "./types";
import requestHandler from "./requestHandler";
import { SignInEndpointEndpointResponse } from "../../../types/responses";

const signIn = async ({
  username,
  password,
  onInit = () => {},
  onSuccess = () => {},
  onError = () => {},
  onFinish = () => {},
}: SignInConfig ) => {
  onInit();

  try {
    const response = (
      await requestHandler
        .post(`/auth/signin`, {
          username,
          password
        })
    ).data as SignInEndpointEndpointResponse;

   onSuccess(response);
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

export default signIn;