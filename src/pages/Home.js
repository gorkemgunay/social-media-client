import { useEffect } from "react";
import { Footer, Header, Post, PostsList } from "../components";
import { useSocketContext } from "../contexts/SocketContext";
import { useHandleFetchUser } from "../api/user";
import { useHandleFetchPosts } from "../api/post";

function Home() {
  const { socket } = useSocketContext();

  const { posts, setPosts } = useHandleFetchPosts();
  useHandleFetchUser();

  useEffect(() => {
    socket.on("getNewPost", (newPost) => {
      setPosts((prev) => [newPost, ...prev]);
    });
  }, []);

  useEffect(() => {
    if (posts) {
      socket.on("getUpdatedPost", (updatedPost) => {
        const updatedPosts = posts.map((post) => {
          if (post._id === updatedPost._id) {
            return updatedPost;
          }
          return post;
        });
        setPosts(updatedPosts);
      });
    }
  }, [posts]);

  useEffect(() => {
    if (posts) {
      socket.on("getDeletedPost", (deletedPost) => {
        setPosts(posts.filter((post) => post._id !== deletedPost._id));
      });
    }
  }, [posts]);

  let content;
  if (!posts) {
    content = <p>Loading...</p>;
  } else if (posts.length === 0) {
    content = (
      <div className="p-4 text-yellow-600 bg-yellow-50 rounded">
        No posts yet.
      </div>
    );
  } else if (posts) {
    content = (
      <PostsList>
        {posts.map((post) => (
          <Post key={post._id} post={post} substring />
        ))}
      </PostsList>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto pt-8 px-4">
        <h2 className="mb-4">Home Page</h2>
        {content}
      </div>
      <Footer />
    </>
  );
}

export default Home;
