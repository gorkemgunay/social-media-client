import React from "react";
import { Link } from "react-router-dom";
import { useSocketContext } from "../contexts/SocketContext";
import useAxiosPrivate from "../useAxiosPrivate";
import Button from "./Button";

function Notification({ id, type, sender }) {
  const { socket } = useSocketContext();
  const axiosPrivate = useAxiosPrivate();

  return (
    <div className="flex items-center justify-between gap-1 h-14 px-4 text-sm cursor-pointer transition-colors hover:bg-slate-50">
      <p>
        <Link to={`/profile/${sender._id}`}>
          {sender.name} {sender.surname}
        </Link>{" "}
        send you a {type}.
      </p>
      <Button
        type="button"
        className="px-2 h-6 text-xs text-indigo-600 bg-indigo-50 transition-colors hover:bg-indigo-100"
        onClick={async () => {
          const response = await axiosPrivate.delete(`/notification/${id}`);
          const data = response?.data;
          if (data) {
            socket.emit("deleteMessageNotification", data);
          }
        }}>
        Delete
      </Button>
    </div>
  );
}

export default React.memo(Notification);
