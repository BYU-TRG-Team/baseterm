import requestHandler from "./requestHandler";
import { DeleteAuxElementConfig } from "./types";

const deleteAuxElement = async (
  {
    elementType,
    uuid,
    termbaseUUID,
    onInit = () => {},
    onError,
    onFinish = () => {},
  }: DeleteAuxElementConfig
) => {
  onInit();

  try {
    await requestHandler
      .delete(`/termbase/${termbaseUUID}/auxElement/${uuid}`, {
        data: { elementType }
      });

  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while deleting the aux element."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default deleteAuxElement;