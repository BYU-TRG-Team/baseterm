import requestHandler from "./requestHandler";
import { PostTermbaseConfig } from "./types";
import { PostTermbaseEndpointResponse } from "../../../types/responses";

const postTermbase = async (
  postTermbaseConfig: PostTermbaseConfig
) => {
  postTermbaseConfig.onInit();

  try {
      const response = (
        await requestHandler
          .post(`/termbase`, {
            name: postTermbaseConfig.name,
            lang: postTermbaseConfig.language,
            ...(
              postTermbaseConfig.description !== null &&
              {
                description: postTermbaseConfig.description,
              }
            )
          })
      ).data as PostTermbaseEndpointResponse

    postTermbaseConfig.onSuccess(response.uuid);
  } catch(err: any) {
    const errorMessage = 
      err.response?.data?.error !== undefined ?
      err.response?.data?.error :
      "There was a problem on the server while creating the termbase."

    postTermbaseConfig.onError(errorMessage);
  } finally {
    postTermbaseConfig.onFinish();
  }
}

export default postTermbase;