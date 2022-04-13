import requestHandler from "./requestHandler";
import { DeleteTermbaseConfig } from "./types";

const deleteTermbase = async (
  deleteTermbaseConfig: DeleteTermbaseConfig
) => {
  deleteTermbaseConfig.onInit();

  try {
    await requestHandler
      .delete(`/termbase/${deleteTermbaseConfig.uuid}`);

  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while deleting the termbase."

    deleteTermbaseConfig.onError(errorMessage);
  } finally {
    deleteTermbaseConfig.onFinish();
  }
}

export default deleteTermbase