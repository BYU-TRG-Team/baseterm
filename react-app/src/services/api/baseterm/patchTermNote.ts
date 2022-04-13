import { PatchTermNoteConfig } from "./types";
import { PatchTermNoteEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";

const patchTermNote = async (
  {
    termbaseUUID,
    uuid,
    id,
    type,
    value,
    grpId,
    target,
    datatype,
    langCode,
    order,
    onInit = () => {},
    onSuccess = async () => {},
    onError = () => {},
    onFinish = () => {},
  }: PatchTermNoteConfig,
) => {
  onInit();

  try {
    const updatedTermNote = (
      await requestHandler
        .patch(`/termbase/${termbaseUUID}/termNote/${uuid}`, {
          ...(id !== undefined && { id }),
          ...(type !== undefined && { type }),
          ...(value !== undefined && { value }),
          ...(grpId !== undefined && { grpId }),
          ...(target !== undefined && { target }),
          ...(datatype !== undefined && { datatype }),
          ...(langCode !== undefined && { langCode }),
          ...(order !== undefined && { order}),
        })
    ).data as PatchTermNoteEndpointResponse;

   await onSuccess(
     updatedTermNote
   );
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while updating the term note."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default patchTermNote;