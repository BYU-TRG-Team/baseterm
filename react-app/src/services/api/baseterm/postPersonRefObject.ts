import { PostPersonRefObjectConfig } from "./types";
import { PostPersonRefObjectEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";

const postPersonRefObject = async ({
  name,
  email,
  role,
  id,
  termbaseUUID,
  onInit = () => {},
  onSuccess = () => {},
  onError = () => {},
  onFinish = () => {},
}: PostPersonRefObjectConfig) => {
  onInit();

  try {
    const response = (
      await requestHandler
        .post(`/termbase/${termbaseUUID}/personRefObject`, {
          name,
          email,
          role,
          id,
        })
    ).data as PostPersonRefObjectEndpointResponse;

   onSuccess(
    response
   );
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while creating the new person ref object."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default postPersonRefObject;