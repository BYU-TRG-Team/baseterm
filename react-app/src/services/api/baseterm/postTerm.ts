import { PostTermConfig } from "./types";
import { PostTermEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";

const postTerm = async ({
  termbaseUUID,
  langSecUUID,
  value,
  onInit = () => {},
  onSuccess = () => {},
  onError = () => {},
  onFinish = () => {},
}: PostTermConfig ) => {
  onInit();

  try {
    const newLangSec = (
      await requestHandler
        .post(`/termbase/${termbaseUUID}/term`, {
          langSecUUID,
          value,
        })
    ).data as PostTermEndpointResponse;

   onSuccess(
     newLangSec
   );
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while updating the new term."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default postTerm;