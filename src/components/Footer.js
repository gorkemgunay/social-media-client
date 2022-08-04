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
    return () => {
      socket.off("userConnect");
    };
  }, [user]);

  useEffect(() => {
    socket.on("getOnlineUsers", (data) => {
      setOnlineUsers(data);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, []);

  let content;
  if (!onlineUsers) {
    content = <p>Loading...</p>;
  } else if (onlineUsers.length === 0) {
    content = (
      <div className="p-4 my-4 text-yellow-600 bg-yellow-50 dark:text-yellow-50 dark:bg-yellow-600 rounded">
        Online users not found.
      </div>
    );
  } else if (onlineUsers) {
    content = onlineUsers.map((online) => (
      <p key={online._id} className="text-xs sm:text-sm">
        {online.name} {online.surname}
      </p>
    ));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h4 className="mb-4">Active Users</h4>
      <div className="flex items-center gap-4 flex-wrap">{content}</div>
    </div>
  );
}

export default React.memo(Footer);
