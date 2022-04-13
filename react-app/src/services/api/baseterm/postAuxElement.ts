import { PostAuxElementConfig } from "./types";
import { PostAuxElementEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";

const postAuxElement = async ({
  termbaseUUID,
  parentUUID,
  elementType,
  parentElementType,
  value,
  type,
  target,
  onInit = () => {},
  onSuccess = async () => {},
  onError,
  onFinish = () => {},
}: PostAuxElementConfig ) => {
  onInit();

  try {
    const newEntry = (
      await requestHandler
        .post(`/termbase/${termbaseUUID}/auxElement`, {
          parentUUID,
          elementType,
          parentElementType,
          value,
          ...(type !== undefined && { type }),
          ...(target !== undefined && { target })
        })
    ).data as PostAuxElementEndpointResponse;

   onSuccess(
     newEntry
   );
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while creating the new aux element."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default postAuxElement;