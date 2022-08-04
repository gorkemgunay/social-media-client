import { useEffect } from "react";
import axios from "./axios";
import { useAuthContext } from "./contexts/AuthContext";

const useAxiosPrivate = () => {
  const { accessToken, setAccessToken } = useAuthContext();

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      (config) => {
        if (!config.headers.authorization) {
          config.headers.authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const response = await axios.post("/user/refresh-token", {
            refreshToken: localStorage.getItem("user"),
          });
          const data = response?.data;
          setAccessToken(data.accessToken);
          prevRequest.headers.authorization = `Bearer ${data.accessToken}`;
          localStorage.setItem("user", data.refreshToken);
          return axios(prevRequest);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, setAccessToken]);

  return axios;
};

export default useAxiosPrivate;
