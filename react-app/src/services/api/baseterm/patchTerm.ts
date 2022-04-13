import { PatchTermConfig } from "./types";
import { PatchTermEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";

const patchTerm = async (
  {
    termbaseUUID,
    uuid,
    id,
    termSecId,
    value,
    order,
    onInit = () => {},
    onSuccess = async () => {},
    onError = () => {},
    onFinish = () => {},
  }: PatchTermConfig,
) => {
  onInit();

  try {
    const updatedTerm = (
      await requestHandler
        .patch(`/termbase/${termbaseUUID}/term/${uuid}`, {
          ...(id !== undefined && { id }),
          ...(termSecId !== undefined && { termSecId }),
          ...(value !== undefined && { value }),
          ...(order !== undefined && { order }),
        })
    ).data as PatchTermEndpointResponse;

   await onSuccess(
    updatedTerm
   );
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while updating the term."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default patchTerm;