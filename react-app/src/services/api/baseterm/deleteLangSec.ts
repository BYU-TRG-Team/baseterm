import requestHandler from "./requestHandler";
import { DeleteLangSecConfig } from "./types";

const deleteLangSec = async (
  {
    uuid,
    termbaseUUID,
    onInit = () => {},
    onError,
    onFinish = () => {},
  }: DeleteLangSecConfig
) => {
  onInit();

  try {
    await requestHandler
      .delete(`/termbase/${termbaseUUID}/langSec/${uuid}`);

  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while deleting the language section."

    onError(errorMessage);
  } finally {
    onFinish();
  }
}

export default deleteLangSec;