import { PatchAuxElementConfig } from "./types";
import { PatchAuxElementEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";

const patchAuxElement = async ({
  id,
  grpId,
  elementType,
  order,
  target,
  langCode,
  datatype,
  type,
  value,
  termbaseUUID,
  uuid,
  onInit = () => {},
  onSuccess = async () => {},
  onError = () => {},
  onFinish = () => {},
}: PatchAuxElementConfig ) => {
  onInit();

  try {
    const updatedAuxElement = (
      await requestHandler
        .patch(`/termbase/${termbaseUUID}/auxElement/${uuid}`, {
          ...(id !== undefined && { id }),
          ...(elementType !== undefined && { elementType }),
          ...(order !== undefined && { order }),
          ...(target !== undefined && { target }),
          ...(langCode !== undefined && { langCode }),
          ...(datatype !== undefined && { datatype }),
          ...(type !== undefined && { type }),
          ...(value !== undefined && { value }),
          ...(grpId !== undefined && { grpId })
        })
    ).data as PatchAuxElementEndpointResponse;

   await onSuccess(
    updatedAuxElement,
   );
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while updating the aux element."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default patchAuxElement;