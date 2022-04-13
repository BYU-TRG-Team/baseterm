import { PatchLangSecConfig } from "./types";
import { PatchLangSecEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";

const patchLangSec = async ({
  termbaseUUID,
  uuid,
  langCode,
  order,
  onInit = () => {},
  onSuccess = async () => {},
  onError = () => {},
  onFinish = () => {},
}: PatchLangSecConfig ) => {
  onInit();

  try {
    const updatedLangSec = (
      await requestHandler
        .patch(`/termbase/${termbaseUUID}/langSec/${uuid}`, {
          ...(langCode !== undefined && { langCode }),
          ...(order !== undefined && { order }),
        })
    ).data as PatchLangSecEndpointResponse;

   await onSuccess(
    updatedLangSec,
   );
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while updating the language section."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default patchLangSec;