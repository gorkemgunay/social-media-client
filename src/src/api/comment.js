import { useEffect, useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";

export const useHandleFetchComments = (postId) => {
  const [comments, setComments] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getComments = async () => {
      const response = await axiosPrivate.get(`/comment/${postId}`);
      const data = response?.data;
      setComments(data);
    };
    getComments();
  }, [postId]);

  return { comments, setComments };
};
