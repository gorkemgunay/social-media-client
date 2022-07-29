import React, { useEffect, useState } from "react";
import { useSocketContext } from "../contexts/SocketContext";
import { useUserContext } from "../contexts/UserContext";

function Footer() {
  const [onlineUsers, setOnlineUsers] = useState(null);
  const { socket } = useSocketContext();
  const { user } = useUserContext();

  useEffect(() => {
    if (user) {
      socket.emit("userConnect", user);
    }
  }, [user]);

  useEffect(() => {
    socket.on("getOnlineUsers", (data) => {
      setOnlineUsers(data);
    });
  }, []);

  let content;
  if (!onlineUsers) {
    content = <p>Loading...</p>;
  } else if (onlineUsers.length === 0) {
    content = (
      <div className="p-4 text-yellow-600 bg-yellow-50 rounded">
        Online users not found.
      </div>
    );
  } else if (onlineUsers) {
    content = onlineUsers.map((online) => (
      <div key={online._id} className="text-sm capitalize">
        {online.name} {online.surname}
      </div>
    ));
  }

  return (
    <div className="my-8">
      <h4 className="mb-4">Active Users</h4>
      <div className="flex items-center gap-4">{content}</div>
    </div>
  );
}

export default React.memo(Footer);
