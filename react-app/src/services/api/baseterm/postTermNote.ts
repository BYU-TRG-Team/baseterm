import { PostTermNoteConfig } from "./types";
import { PostTermNoteEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";

const postTermNote = async ({
  termbaseUUID,
  termUUID,
  type,
  isGrp,
  value,
  onSuccess = async () => {},
  onError = () => {},
  onFinish = () => {},
  onInit = () => {}
}: PostTermNoteConfig ) => {
  onInit();

  try {
    const newTermNote = (
      await requestHandler
        .post(`/termbase/${termbaseUUID}/termNote`, {
          termUUID,
          type,
          isGrp,
          value,
        })
    ).data as PostTermNoteEndpointResponse;

   onSuccess(
     newTermNote
   );
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while creating the new term note."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default postTermNote;