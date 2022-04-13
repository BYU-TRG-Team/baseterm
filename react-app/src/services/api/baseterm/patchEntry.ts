import { PatchEntryConfig } from "./types";
import { PatchEntryEndpointReponse } from "../../../types/responses";
import requestHandler from "./requestHandler";

const patchEntry = async ({
  id,
  onInit = () => {},
  termbaseUUID,
  uuid,
  onSuccess = async () => {},
  onError = () => {},
  onFinish = () => {},
}: PatchEntryConfig ) => {
  onInit();

  try {
    const updatedEntry = (
      await requestHandler
        .patch(`/termbase/${termbaseUUID}/entry/${uuid}`, {
          ...(id !== undefined && { id }),
        })
    ).data as PatchEntryEndpointReponse;

   await onSuccess(
     updatedEntry
   );
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while updating the concept entry."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default patchEntry;