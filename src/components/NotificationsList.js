import React, { useEffect } from "react";
import { useNotificationsContext } from "../contexts/NotificationsContext";
import { useSocketContext } from "../contexts/SocketContext";
import useAxiosPrivate from "../useAxiosPrivate";
import Notification from "./Notification";

function NotificationsList({ openNotification, setOpenNotification }) {
  const { notifications, setNotifications } = useNotificationsContext();
  const { socket } = useSocketContext();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (notifications && notifications.length !== 0) {
      document.title = `(${notifications.length}) Social Media`;
    }
    if (notifications.length === 0) {
      document.title = "Social Media";
    }
  }, [notifications]);

  useEffect(() => {
    const handleFetchNotifications = async () => {
      const response = await axiosPrivate.get("/notification");
      const data = response?.data;
      setNotifications(data);
    };
    handleFetchNotifications();
  }, []);

  useEffect(() => {
    socket.on("getNewMessageNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    return () => {
      socket.off("getNewMessageNotification");
    };
  }, []);

  useEffect(() => {
    if (notifications) {
      socket.on("getDeletedMessageNotification", (deletedNotification) => {
        setNotifications(
          notifications.filter(
            (notification) => notification._id !== deletedNotification._id,
          ),
        );
      });
    }

    return () => {
      socket.off("getDeletedMessageNotification");
    };
  }, [notifications]);

  return (
    <div
      className={`absolute top-10 right-0 ${
        !openNotification && "hidden"
      } flex flex-col w-80 shadow bg-white dark:bg-slate-900 overflow-hidden rounded`}>
      {notifications.map((conversation) => (
        <Notification
          key={conversation._id}
          id={conversation._id}
          type={conversation.type}
          sender={conversation.sender}
          relatedId={conversation.relatedId}
          setOpenNotification={setOpenNotification}
        />
      ))}

      {notifications.length === 0 && (
        <div className="flex items-center h-14 px-4 text-sm transition-colors bg-white hover:bg-slate-50 dark:bg-slate-900 hover:dark:bg-slate-800">
          <p>There is no notification here.</p>
        </div>
      )}
    </div>
  );
}

export default React.memo(NotificationsList);
