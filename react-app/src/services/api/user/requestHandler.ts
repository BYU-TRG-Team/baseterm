import axios from "axios";

const requestHandler = axios.create({
  baseURL: "/api",
  responseType: 'json',
});

requestHandler.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.data?.code === "PASSWORD_CHANGE_REQUIRED" &&
      window.location.pathname !== "/edit-profile"
    ) {
      window.location.href = "/edit-profile?changePassword=1";
    }

    return Promise.reject(error);
  },
);

export default requestHandler;