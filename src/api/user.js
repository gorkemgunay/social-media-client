import { useEffect, useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";
import { useUserContext } from "../contexts/UserContext";

export const useHandleFetchUserProfile = (userId) => {
  const [profile, setProfile] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const handleFetchUserProfile = async () => {
      const response = await axiosPrivate.get(`/user/${userId}`);
      const data = response?.data;
      setProfile(data);
    };

    handleFetchUserProfile();
  }, [userId]);

  return { profile, setProfile };
};

export const useHandleFetchUser = () => {
  const { user, setUser } = useUserContext();

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const handleFetchUser = async () => {
      const response = await axiosPrivate.get("/user/me");
      const data = response?.data;
      setUser(data);
    };
    if (!user) {
      handleFetchUser();
    }
  }, [user]);

  return { user, setUser };
};
