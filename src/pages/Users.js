import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../useAxiosPrivate";
import { Header, Footer, Button, Search } from "../components";
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
  }, [users]);

  let content;
  if (!users) {
    content = <p>Loading...</p>;
  } else if (users) {
    content = (
      <div className="max-h-96 overflow-scroll flex flex-col gap-4">
        {searchUsersResult.map((currentUser) => (
          <div
            key={currentUser._id}
            className="flex items-center justify-between gap-4 px-4 py-4 h-16 rounded border border-slate-100">
            <p className="text-sm font-semibold capitalize">
              {currentUser.name} {currentUser.surname}
            </p>
            <div className="flex items-center gap-4">
              <Link
                to={`/profile/${currentUser._id}`}
                className="flex items-center justify-center whitespace-nowrap rounded disabled:bg-indigo-50 disabled:text-indigo-600 disabled:cursor-not-allowed px-2 h-6 text-xs text-indigo-600 bg-indigo-50 transition-colors hover:bg-indigo-100">
                Profile
              </Link>

              <Button
                onClick={async () => {
                  const response = await axiosPrivate.post("/conversation", {
                    receiverId: currentUser?._id,
                  });
                  const data = response?.data;
                  if (data) {
                    navigate(`/conversation/${data._id}`);
                  }
                }}
                type="button"
                className="px-2 h-6 text-xs text-indigo-600 bg-indigo-50 transition-colors hover:bg-indigo-100">
                Send Message
              </Button>
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
        <div className="mb-4">
          <Search users={users} setSearchUsersResult={setSearchUsersResult} />
        </div>
        {content}
      </div>
      <Footer />
    </>
  );
}

export default Users;
