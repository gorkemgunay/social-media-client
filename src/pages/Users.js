import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../useAxiosPrivate";
import { Header, Footer, Button } from "../components";
import { useUserContext } from "../contexts/UserContext";
import { useSocketContext } from "../contexts/SocketContext";

function Users() {
  const [users, setUsers] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const { user, setUser } = useUserContext();
  const { socket } = useSocketContext();
  const navigate = useNavigate();

  // TODO: when user register, update the users state with socket

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
      <div className="flex flex-col gap-4">
        {users.map((currentUser) => (
          <div key={currentUser._id} className="flex items-center gap-4">
            <Link to={`/profile/${currentUser._id}`}>
              <p className="capitalize">
                {currentUser.name} {currentUser.surname}
              </p>
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
              className="px-2 h-6 text-xs text-indigo-600 bg-indigo-50">
              Send Message
            </Button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto pt-8">
        <h2 className="mb-4">Users Page</h2>
        {content}
        <Footer />
      </div>
    </>
  );
}

export default Users;
