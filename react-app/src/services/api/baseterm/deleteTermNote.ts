import requestHandler from "./requestHandler";
import { DeleteTermNoteConfig } from "./types";

const deleteTermNote = async (
  {
    onInit = () => ({}),
    onError,
    onFinish = () => ({}),
    termbaseUUID,
    uuid,
  }: DeleteTermNoteConfig
) => {
  onInit();

  try {
    await requestHandler
      .delete(`/termbase/${termbaseUUID}/termNote/${uuid}`);

  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while deleting the term note."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default deleteTermNote