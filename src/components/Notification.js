import React from "react";
import { Link } from "react-router-dom";
import { useSocketContext } from "../contexts/SocketContext";
import useAxiosPrivate from "../useAxiosPrivate";
import Button from "./Button";

function Notification({ id, type, sender, relatedId, setOpenNotification }) {
  const { socket } = useSocketContext();
  const axiosPrivate = useAxiosPrivate();

  return (
    <div className="relative">
      <Link
        to={`/conversation/${relatedId}`}
        onClick={() => setOpenNotification(false)}
        className="flex items-center gap-1 min-h-[56px] py-2 px-4 text-sm
      cursor-pointer transition-colors bg-white hover:bg-slate-50
      dark:bg-slate-900 hover:dark:bg-slate-800">
        <p className="font-normal w-56">
          <span className="font-semibold">
            {sender.name} {sender.surname}
          </span>{" "}
          send you a {type}.
        </p>
      </Link>
      <Button
        type="button"
        className="primary-small-btn absolute right-4 top-1/2 -translate-y-1/2"
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
