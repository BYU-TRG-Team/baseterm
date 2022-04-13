import requestHandler from "./requestHandler";
import { DeleteEntryConfig } from "./types";

const deleteEntry = async (
  {
    uuid,
    termbaseUUID,
    onInit = () => {},
    onError,
    onFinish = () => {},
  }: DeleteEntryConfig
) => {
  onInit();

  try {
    await requestHandler
      .delete(`/termbase/${termbaseUUID}/entry/${uuid}`);

  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while deleting the concept entry."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default deleteEntry;