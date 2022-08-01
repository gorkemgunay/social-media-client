import React from "react";
import { Link } from "react-router-dom";
import { useSocketContext } from "../contexts/SocketContext";
import useAxiosPrivate from "../useAxiosPrivate";
import Button from "./Button";

function Notification({ id, type, sender, setOpenNotification }) {
  const { socket } = useSocketContext();
  const axiosPrivate = useAxiosPrivate();

  return (
    <div className="flex items-center justify-between gap-1 h-14 px-4 text-sm cursor-pointer transition-colors bg-white hover:bg-slate-50 dark:bg-slate-900 hover:dark:bg-slate-800">
      <p>
        <Link
          to={`/profile/${sender._id}`}
          onClick={() => setOpenNotification(false)}>
          {sender.name} {sender.surname}
        </Link>{" "}
        send you a {type}.
      </p>
      <Button
        type="button"
        className="primary-small-btn"
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
