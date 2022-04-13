import { GetUserEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";
import { GetUserConfig } from "./types";

const getUser = async ({
  uuid,
  onSuccess = () => {},
  onInit = () => {},
  onError = () => {},
  onFinish = () => {},
}: GetUserConfig ) => {
  onInit();

  try {
    const response = (
      await requestHandler
        .get(`/user/${uuid}`)
    ).data as GetUserEndpointResponse;

    onSuccess(response);
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while retrieving user data."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default getUser;