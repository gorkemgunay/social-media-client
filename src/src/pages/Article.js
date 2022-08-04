import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Footer, Header, Post } from "../components";
import { useSocketContext } from "../contexts/SocketContext";
import { useHandleFetchPost } from "../api/post";
import { useHandleFetchUser } from "../api/user";

function Article() {
  const { postId } = useParams();
  const { socket } = useSocketContext();
  const { post, setPost } = useHandleFetchPost(postId);
  useHandleFetchUser();

  useEffect(() => {
    if (post) {
      socket.on("getUpdatedPost", (updatedPost) => {
        setPost(updatedPost);
      });
    }
    return () => {
      socket.off("getUpdatedPost");
    };
  }, [post]);

  useEffect(() => {
    if (post) {
      socket.on("getDeletedPost", (deletedPost) => {
        if (deletedPost) {
          setPost(null);
        }
      });
    }
    return () => {
      socket.off("getDeletedPost");
    };
  }, [post]);

  let content;
  if (!post) {
    content = <p>Loading...</p>;
  } else if (post) {
    content = <Post post={post} showComments />;
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <h2 className="mb-4">Post Page</h2>
        {content}
      </div>
      <Footer />
    </>
  );
}

export default Article;
