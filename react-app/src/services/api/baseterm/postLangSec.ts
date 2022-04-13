import { PostLangSecConfig } from "./types";
import { PostLangSecEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";

const postLangSec = async ({
  termbaseUUID,
  entryUUID,
  langCode,
  initialTerm,
  onInit = () => {},
  onSuccess = () => {},
  onError,
  onFinish = () => {},
}: PostLangSecConfig ) => {
  onInit();

  try {
    const newLangSec = (
      await requestHandler
        .post(`/termbase/${termbaseUUID}/langSec`, {
          entryUUID,
          langCode,
          initialTerm,
        })
    ).data as PostLangSecEndpointResponse;

   onSuccess(
     newLangSec
   );
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while creating the new language section."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default postLangSec;