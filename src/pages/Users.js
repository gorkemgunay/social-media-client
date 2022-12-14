import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../useAxiosPrivate";
import { Header, Footer, Button, UserSearch } from "../components";
import { useUserContext } from "../contexts/UserContext";
import { useSocketContext } from "../contexts/SocketContext";

function Users() {
  const [users, setUsers] = useState(null);
  const [searchUsersResult, setSearchUsersResult] = useState(null);
  const { user, setUser } = useUserContext();
  const { socket } = useSocketContext();
  const navigate = useNavigate();
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

  useEffect(() => {
    const handleFetchUsers = async () => {
      const response = await axiosPrivate.get("/user");
      const data = response?.data;
      const filteredData = data.filter((filter) => filter._id !== user._id);
      setUsers(filteredData);
      setSearchUsersResult(filteredData);
    };
    if (user) {
      handleFetchUsers();
    }
  }, [user]);

  useEffect(() => {
    if (users) {
      socket.on("getRegisteredUser", (registeredUser) => {
        setUsers((prev) => [...prev, registeredUser]);
      });
    }

    return () => {
      socket.off("getRegisteredUser");
    };
  }, [users]);

  let content;
  if (!users) {
    content = <p>Loading...</p>;
  } else if (users) {
    content = (
      <div className="max-h-96 overflow-scroll flex flex-col gap-4">
        {searchUsersResult.map((currentUser) => (
          <div key={currentUser._id}>
            <div className="flex items-center sm:justify-between flex-col sm:flex-row gap-4 px-4 py-4 h-24 sm:h-16 rounded border border-slate-100 dark:border-slate-900">
              <p className="text-sm font-semibold">
                {currentUser.name} {currentUser.surname}
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to={`/profile/${currentUser._id}`}
                  className="primary-small-btn flex items-center justify-center whitespace-nowrap rounded">
                  Profile
                </Link>

                <Button
                  onClick={async () => {
                    const response = await axiosPrivate.post("/conversation", {
                      receiverId: currentUser?._id,
                    });
                    const data = response?.data;
                    if (data) {
                      socket.emit("createConversation", {
                        ...data,
                        users: [user, currentUser],
                        receiver: currentUser._id,
                      });
                      navigate(`/conversation/${data._id}`);
                    }
                  }}
                  type="button"
                  className="primary-small-btn">
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <h2 className="mb-4">Users Page</h2>
        <div className="pb-4">
          <UserSearch
            users={users}
            setSearchUsersResult={setSearchUsersResult}
          />
        </div>
        {content}
      </div>
      <Footer />
    </>
  );
}

export default Users;
