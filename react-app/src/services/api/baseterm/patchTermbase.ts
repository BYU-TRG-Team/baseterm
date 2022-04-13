import { PatchTermbaseConfig } from "./types";
import { PatchTermbaseEndpointReponse } from "../../../types/responses";
import requestHandler from "./requestHandler";

const patchTermbase = async (
  {
    onInit,
    onSuccess,
    onError,
    onFinish,
    name,
    type,
    enforceBasicDialect,
    uuid,
  }: PatchTermbaseConfig,
) => {
  onInit();

  try {
    const updatedTermbase = (
      await requestHandler
        .patch(`/termbase/${uuid}`, {
          ...(name !== undefined && { name }),
          ...(type !== undefined && { type }),
          ...(enforceBasicDialect !== undefined && { enforceBasicDialect }),
        })
    ).data as PatchTermbaseEndpointReponse;

    onSuccess(
      updatedTermbase
    );
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while updating the termbase."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default patchTermbase;