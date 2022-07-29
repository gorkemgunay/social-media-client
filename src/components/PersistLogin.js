import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import Loader from "./Loader";
import axios from "../axios";

function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, setAccessToken } = useAuthContext();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        const response = await axios.post("/user/refresh-token", {
          refreshToken: localStorage.getItem("user"),
        });
        const data = response?.data;
        setAccessToken(data.accessToken);
        localStorage.setItem("user", data.refreshToken);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (!accessToken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [accessToken, setAccessToken]);

  if (!isLoading && !accessToken) {
    return <Navigate to="/login" replace />;
  }
  if (isLoading && !accessToken) {
    return <Loader />;
  }
  return !isLoading && accessToken && <Outlet />;
}

export default React.memo(PersistLogin);
