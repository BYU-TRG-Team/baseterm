import { GetAllUsersEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";
import { GetAllUsersConfig } from "./types";

const getAllUsers = async ({
  onSuccess = () => {},
  onInit = () => {},
  onError = () => {},
  onFinish = () => {},
}: GetAllUsersConfig ) => {
  onInit();

  try {
    const response = (
      await requestHandler
        .get(`/users`)
    ).data as GetAllUsersEndpointResponse;

    onSuccess(response);
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while retrieving all users."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default getAllUsers;