import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Header,
  Button,
  PostsList,
  Post,
  CreatePost,
  Footer,
  ProfileSettings,
  Followers,
  Following,
} from "../components";
import { useSocketContext } from "../contexts/SocketContext";
import { useHandleFetchPostsUser } from "../api/post";
import { useHandleFetchUser, useHandleFetchUserProfile } from "../api/user";
import useAxiosPrivate from "../useAxiosPrivate";

function Profile() {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showProfileSettingsModal, setShowProfileSettingsModal] =
    useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [disableFollowButton, setDisableFollowButton] = useState(false);
  const { userId } = useParams();

  const { socket } = useSocketContext();

  const axiosPrivate = useAxiosPrivate();

  const { userPosts, setUserPosts } = useHandleFetchPostsUser(userId);
  const { profile, setProfile } = useHandleFetchUserProfile(userId);
  const { user } = useHandleFetchUser();

  const navigate = useNavigate();

  useEffect(() => {
    setProfile(null);
    setUserPosts(null);
  }, [userId]);

  useEffect(() => {
    socket.on("getUserNewPost", (newPost) => {
      setUserPosts((prev) => [newPost, ...prev]);
    });
    return () => {
      socket.off("getUserNewPost");
    };
  }, []);

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
    return () => {
      socket.off("getUserUpdatedPost");
    };
  }, [userPosts]);

  useEffect(() => {
    if (userPosts) {
      socket.on("getDeletedUserPost", (deletedPost) => {
        setUserPosts(
          userPosts.filter((userPost) => userPost._id !== deletedPost._id),
        );
      });
    }
    return () => {
      socket.off("getDeletedUserPost");
    };
  }, [userPosts]);

  useEffect(() => {
    if (profile) {
      socket.on("getFollower", (follower) => {
        if (follower.profile === profile?._id) {
          setProfile({
            ...profile,
            followers: [...profile.followers, follower.user],
          });
        }
        if (follower.user === profile?._id) {
          setProfile({
            ...profile,
            following: [...profile.following, follower.user],
          });
        }
      });
    }

    return () => {
      socket.off("getFollower");
    };
  }, [profile]);

  useEffect(() => {
    if (profile) {
      socket.on("getUnfollower", (unfollower) => {
        if (
          unfollower.profile === profile?._id ||
          user?._id === unfollower.user._id
        ) {
          setProfile({
            ...profile,
            followers: profile.followers.filter(
              (p) => p._id !== unfollower.user._id,
            ),
          });
        }
        if (unfollower.user._id === profile?._id) {
          setProfile({
            ...profile,
            following: profile.following.filter(
              (u) => u._id !== unfollower.user._id,
            ),
          });
        }
      });
    }

    return () => {
      socket.off("getUnfollower");
    };
  }, [profile]);

  useEffect(() => {
    if (profile) {
      socket.on("getBiography", (updatedBiography) => {
        if (updatedBiography.profileId === profile?._id) {
          setProfile({ ...profile, biography: updatedBiography.biography });
        }
      });
    }

    return () => {
      socket.off("getBiography");
    };
  }, [profile]);

  const handleFetchFollow = async () => {
    setDisableFollowButton(true);
    const response = await axiosPrivate.get(`/follow/${userId}`);
    const data = response?.data;
    if (data) {
      socket.emit("followUser", { user, profile: profile?._id });
      toast.success("Successfully followed.");
      setDisableFollowButton(false);
    }
    setDisableFollowButton(false);
  };

  const handleFetchUnfollow = async () => {
    setDisableFollowButton(true);
    const response = await axiosPrivate.delete(`/follow/${userId}`);
    const data = response?.data;
    if (data) {
      socket.emit("unfollowUser", { user, profile: profile?._id });
      toast.success("Successfully unfollowed.");
      setDisableFollowButton(false);
    }
    setDisableFollowButton(false);
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
      <div className="w-full flex items-center justify-center flex-col gap-4">
        <div className="flex items-center justify-center flex-col gap-1">
          <h2 className="capitalize">
            {profile.name} {profile.surname}
          </h2>
          <small>{profile.email}</small>
        </div>
        <div className="flex items-center gap-8">
          <button
            type="button"
            className="flex items-center flex-col gap-1"
            onClick={() => setShowFollowers(true)}>
            <p className="font-bold">{profile?.followers?.length}</p>
            <h5 className="text-sm">Followers</h5>
          </button>
          <button
            type="button"
            className="flex items-center flex-col gap-1"
            onClick={() => setShowFollowing(true)}>
            <p className="font-bold">{profile?.following?.length}</p>
            <h5 className="text-sm">Following</h5>
          </button>
        </div>
        <div className="flex items-center gap-4">
          {user?._id !== profile?._id &&
            (profile.followers.some((p) => p._id === user?._id) ? (
              <Button
                type="button"
                className="primary-small-btn"
                disabled={disableFollowButton}
                onClick={() => handleFetchUnfollow()}>
                Unfollow
              </Button>
            ) : (
              <Button
                type="button"
                className="primary-small-btn"
                disabled={disableFollowButton}
                onClick={() => handleFetchFollow()}>
                Follow
              </Button>
            ))}

          {user?._id !== profile?._id && (
            <Button
              onClick={async () => {
                const response = await axiosPrivate.post("/conversation", {
                  receiverId: profile?._id,
                });
                const data = response?.data;
                if (data) {
                  socket.emit("createConversation", {
                    ...data,
                    users: [...user, ...profile],
                    receiver: profile._id,
                  });
                  navigate(`/conversation/${data._id}`);
                }
              }}
              type="button"
              className="primary-small-btn">
              Send Message
            </Button>
          )}
          {user?._id === profile?._id && (
            <Button
              type="button"
              className="primary-small-btn"
              onClick={() => setShowCreatePostModal(true)}>
              Create Post
            </Button>
          )}

          {user?._id === profile?._id && (
            <Button
              type="button"
              className="primary-small-btn"
              onClick={() => setShowProfileSettingsModal(true)}>
              Settings
            </Button>
          )}
        </div>
      </div>
    );
    if (!userPosts) {
      userPostsContent = <p>Loading...</p>;
    } else if (userPosts.length === 0) {
      userPostsContent = (
        <div className="p-4 my-4 text-yellow-600 bg-yellow-50 dark:text-yellow-50 dark:bg-yellow-600 rounded">
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
      <div className="max-w-4xl mx-auto pt-8 px-4">
        {profileContent}
        {showCreatePostModal && (
          <CreatePost setShowModal={setShowCreatePostModal} />
        )}
        {showProfileSettingsModal && (
          <ProfileSettings
            profile={profile}
            setShowModal={setShowProfileSettingsModal}
          />
        )}
        {showFollowers && (
          <Followers
            followers={profile?.followers}
            setShowFollowers={setShowFollowers}
          />
        )}
        {showFollowing && (
          <Following
            following={profile?.following}
            setShowFollowing={setShowFollowing}
          />
        )}
        {profile?.biography && (
          <div className="flex flex-col gap-2 pt-4">
            <h4>Biography</h4>
            <p>{profile?.biography}</p>
          </div>
        )}
        <h4 className="my-4">User Posts</h4>
        {userPostsContent}
      </div>
      <Footer />
    </>
  );
}

export default Profile;
