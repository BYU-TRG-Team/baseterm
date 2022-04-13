import { PostEntryConfig } from "./types";
import { PostEntryEndpointResponse } from "../../../types/responses";
import requestHandler from "./requestHandler";

/*
* TODO: Destructure argument and dont return a promise to an already async function
* Can update this for all of these service endpoints
*/
const postEntry = async (
  postEntryConfig: PostEntryConfig,
): Promise<PostEntryEndpointResponse> => {
  return new Promise(async (
    resolve, 
    reject
  ) => {
    postEntryConfig.onInit();

    try {
      const newEntry = (
        await requestHandler
          .post(`/termbase/${postEntryConfig.termbaseUUID}/entry`, {
            initialTerm: postEntryConfig.initialTerm,
            entryId: postEntryConfig.entryId,
            initialLanguageSection: postEntryConfig.initialLanguageSection,
          })
      ).data as PostEntryEndpointResponse;
  
     postEntryConfig.onSuccess(
       newEntry
     );
  
     postEntryConfig.onFinish();
     resolve(newEntry);
    } catch(err: any) {
      const errorMessage = 
        err.response?.data?.error !== undefined ?
        err.response?.data?.error :
        "There was a problem on the server while creating the new entry."

      postEntryConfig.onError(errorMessage);
      postEntryConfig.onFinish();
      reject(err)
    }
  })
}

export default postEntry;