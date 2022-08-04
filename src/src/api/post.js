import { useEffect, useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";

export const useHandleFetchPosts = () => {
  const [posts, setPosts] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getPosts = async () => {
      const response = await axiosPrivate.get("/posts");
      const data = response?.data;
      const orderedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setPosts(orderedData);
    };
    if (!posts) {
      getPosts();
    }
  }, [posts]);

  return { posts, setPosts };
};

export const useHandleFetchPostsUser = (userId) => {
  const [userPosts, setUserPosts] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getUserPosts = async () => {
      const response = await axiosPrivate.get(`/posts/user/${userId}`);
      const data = response?.data;
      const orderedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setUserPosts(orderedData);
    };

    getUserPosts();
  }, [userId]);

  return { userPosts, setUserPosts };
};

export const useHandleFetchPost = (postId) => {
  const [post, setPost] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getPost = async () => {
      const response = await axiosPrivate.get(`/posts/${postId}`);
      const data = response?.data;
      setPost(data);
    };

    getPost();
  }, [postId]);

  return { post, setPost };
};
