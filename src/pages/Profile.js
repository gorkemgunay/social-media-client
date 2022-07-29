import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  Header,
  Button,
  PostsList,
  Post,
  CreatePost,
  Footer,
} from "../components";
import { useAuthContext } from "../contexts/AuthContext";
import { useSocketContext } from "../contexts/SocketContext";
import useAxiosPrivate from "../useAxiosPrivate";
import { useHandleFetchPostsUser } from "../api/post";
import { useHandleFetchUser, useHandleFetchUserProfile } from "../api/user";

function Profile() {
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { userId } = useParams();

  const { setAccessToken } = useAuthContext();
  const { socket, setSocket } = useSocketContext();

  const axiosPrivate = useAxiosPrivate();

  const { userPosts, setUserPosts } = useHandleFetchPostsUser(userId);
  const { profile, setProfile } = useHandleFetchUserProfile(userId);
  const { user, setUser } = useHandleFetchUser();

  useEffect(() => {
    setProfile(null);
    setUserPosts(null);
  }, [userId]);

  useEffect(() => {
    if (userPosts) {
      socket.on("getUserNewPost", (newPost) => {
        setUserPosts((prev) => [newPost, ...prev]);
      });
    }
  }, [userPosts]);

  useEffect(() => {
    if (userPosts) {
      socket.on("getUserUpdatedPost", (updatedPost) => {
        const updatedUserPosts = userPosts.map((post) => {
          if (post._id === updatedPost._id) {
            return updatedPost;
          }
          return post;
        });
        setUserPosts(updatedUserPosts);
      });
    }
  }, [userPosts]);

  useEffect(() => {
    if (userPosts) {
      socket.on("getDeletedUserPost", (deletedPost) => {
        setUserPosts(
          userPosts.filter((userPost) => userPost._id !== deletedPost._id),
        );
      });
    }
  }, [userPosts]);

  const handleLogout = async () => {
    const response = await axiosPrivate.post("/user/logout", {
      refreshToken: localStorage.getItem("user"),
    });
    const data = response?.data;
    if (data) {
      localStorage.removeItem("user");
      setAccessToken(null);
      setUser(null);
      setSocket(null);
      socket.disconnect();
      toast.success("Successfully logout.");
      navigate("/login", { replace: true });
    }
  };

  let profileContent;
  let userPostsContent;
  if (!profile) {
    profileContent = <p>Loading...</p>;
  } else if (profile.error) {
    profileContent = (
      <div className="p-4 text-red-600 bg-red-50">{profile.error}</div>
    );
  } else if (profile) {
    profileContent = (
      <div>
        <div className="flex items-center gap-4">
          <div className="w-full flex items-center justify-between">
            <h3 className="capitalize">
              {profile.name} {profile.surname}
            </h3>
            {user?._id === profile?._id && (
              <Button
                type="button"
                className="px-2 h-6 text-xs text-indigo-600 bg-indigo-50"
                onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>
          {user?._id !== profile?._id && (
            <Button
              onClick={async () => {
                const response = await axiosPrivate.post("/conversation", {
                  receiverId: profile?._id,
                });
                const data = response?.data;
                if (data) {
                  navigate(`/conversation/${data._id}`);
                }
              }}
              type="button"
              className="px-2 h-6 text-xs text-indigo-600 bg-indigo-50">
              Send Message
            </Button>
          )}
        </div>
        <small>{profile.email}</small>
      </div>
    );
    if (!userPosts) {
      userPostsContent = <p>Loading...</p>;
    } else if (userPosts.length === 0) {
      userPostsContent = (
        <div className="p-4 my-4 text-yellow-600 bg-yellow-50 rounded">
          No posts yet.
        </div>
      );
    } else if (userPosts) {
      userPostsContent = (
        <PostsList>
          {userPosts.map((post) => (
            <Post key={post._id} post={post} substring />
          ))}
        </PostsList>
      );
    }
  }

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto pt-8">
        <h2 className="mb-4">Profile Page</h2>
        {profileContent}
        {user?._id === profile?._id && (
          <Button
            type="button"
            className="my-4 text-sm"
            onClick={() => setShowModal(true)}>
            Create Post
          </Button>
        )}
        {showModal && <CreatePost setShowModal={setShowModal} />}
        <h4 className="mb-4">User Posts</h4>
        {userPostsContent}
        <Footer />
      </div>
    </>
  );
}

export default Profile;
