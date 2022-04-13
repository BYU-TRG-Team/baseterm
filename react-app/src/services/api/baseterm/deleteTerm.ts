import requestHandler from "./requestHandler";
import { DeleteTermConfig } from "./types";

const deleteTerm = async (
  {
    uuid,
    termbaseUUID,
    onInit = () => {},
    onError,
    onFinish = () => {},
  }: DeleteTermConfig
) => {
  onInit();

  try {
    await requestHandler
      .delete(`/termbase/${termbaseUUID}/term/${uuid}`);

  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while deleting the term."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default deleteTerm