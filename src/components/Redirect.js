import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import axios from "../axios";
import Loader from "./Loader";

function Redirect() {
  const refreshToken = localStorage.getItem("user");
  const { accessToken, setAccessToken } = useAuthContext();

  useEffect(() => {
    const fetchAuth = async () => {
      const response = await axios.post("/user/refresh-token", {
        refreshToken,
      });
      const data = response?.data;
      setAccessToken(data.accessToken);
      localStorage.setItem("user", data.refreshToken);
      toast.success("You are already logged in.");
    };
    if (refreshToken) {
      fetchAuth();
    }
  }, []);

  if (refreshToken && !accessToken) {
    return <Loader />;
  }

  return accessToken ? <Navigate to="/" replace /> : <Outlet />;
}

export default React.memo(Redirect);
