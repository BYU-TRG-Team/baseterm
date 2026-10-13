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
      window.location.pathname !== "/user-management"
    ) {
      window.location.href = "/user-management?forcePasswordChange=1";
    }

    return Promise.reject(error);
  },
);

export default requestHandler;