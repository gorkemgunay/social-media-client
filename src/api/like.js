import { useEffect, useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";

export const useHandleFetchLikes = (postId) => {
  const [likes, setLikes] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getLikes = async () => {
      const response = await axiosPrivate.get(`/like/${postId}`);
      const data = response?.data;
      setLikes(data);
    };
    getLikes();
  }, [postId]);

  return { likes, setLikes };
};
