import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import useAxiosPrivate from "../useAxiosPrivate";
import { useSocketContext } from "../contexts/SocketContext";
import { useUserContext } from "../contexts/UserContext";
import Button from "./Button";

function Comment({ comment }) {
  const { socket } = useSocketContext();
  const { user } = useUserContext();
  const axiosPrivate = useAxiosPrivate();

  return (
    <div className="flex flex-col gap-2 p-4 border border-slate-100 dark:border-slate-900 rounded">
      <div className="flex items-center justify-between">
        <Link to={`/profile/${comment.user._id}`}>
          <small className="text-slate-400 capitalize">
            {comment.user.name} {comment.user.surname}
          </small>
        </Link>
        {comment.user._id === user._id && (
          <Button
            type="button"
            className="primary-small-btn"
            onClick={async () => {
              const response = await axiosPrivate.delete(
                `/comment/${comment._id}`,
              );
              const data = response?.data;
              if (data) {
                socket.emit("deleteComment", data);
                toast.success("Comment deleted successfully.");
              }
            }}>
            {" "}
            Delete
          </Button>
        )}
      </div>
      <p>{comment.text}</p>
    </div>
  );
}

export default React.memo(Comment);
