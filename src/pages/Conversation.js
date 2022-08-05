import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useAxiosPrivate from "../useAxiosPrivate";
import { Header, Form, Input, Button } from "../components";
import { useSocketContext } from "../contexts/SocketContext";
import { useHandleFetchUser } from "../api/user";
import { useHandleFetchConversation } from "../api/conversation";
import { useNotificationsContext } from "../contexts/NotificationsContext";

function Conversation() {
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [onlines, setOnlines] = useState(null);
  const [windowFocus, setWindowFocus] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const { conversationId } = useParams();
  const { messages, setMessages, receiver } =
    useHandleFetchConversation(conversationId);
  const { user } = useHandleFetchUser();
  const { socket } = useSocketContext();
  const { notifications } = useNotificationsContext();
  const scrollRef = useRef();
  dayjs.extend(relativeTime);

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

  useEffect(() => {
    if (receiver) {
      const onlineUsersArray = receiver.map((r) =>
        onlineUsers.find((o) => o._id === r._id),
      );
      setOnlines(onlineUsersArray);
    }
  }, [receiver, onlineUsers]);

  useEffect(() => {
    socket.on("getNewMessage", (newMessage) => {
      if (newMessage.conversation === conversationId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("getNewMessage");
    };
  }, [conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    window.addEventListener("focus", () => setWindowFocus(true));
    window.addEventListener("blur", () => setWindowFocus(false));
    return () => {
      window.removeEventListener("focus", () => setWindowFocus(true));
      window.removeEventListener("blur", () => setWindowFocus(false));
    };
  }, []);

  useEffect(() => {
    const deleteNotificationAuto = () => {
      const getFilteredNotification = notifications.find(
        (n) =>
          n.receiver === user?._id &&
          receiver?.find((r) => r._id === n.sender._id) &&
          n.relatedId === conversationId,
      );
      const handleDeleteNotification = async () => {
        const response = await axiosPrivate.delete(
          `/notification/${getFilteredNotification?._id}`,
        );
        const data = response?.data;
        if (data) {
          socket.emit("deleteMessageNotification", data);
        }
      };
      if (getFilteredNotification && notifications) {
        handleDeleteNotification();
      }
    };

    if (windowFocus) {
      deleteNotificationAuto();
    }
  }, [user, receiver, notifications, windowFocus, conversationId]);

  const formik = useFormik({
    initialValues: {
      text: "",
    },
    onSubmit: async (values) => {
      values.text = values.text.replace(/  +/g, " ");
      const response = await axiosPrivate.post("/message", {
        text: values.text,
        conversationId,
      });
      const data = response?.data;
      if (data) {
        receiver.map(async (r) => {
          const notification = await axiosPrivate.post("/notification", {
            type: "message",
            receiverId: r?._id,
            relatedId: conversationId,
          });

          socket.emit("createMessageNotification", {
            ...notification?.data,
            sender: user,
            relatedId: conversationId,
          });
        });
        const receivers = onlineUsers.filter((o) =>
          receiver.find((r) => r._id === o._id),
        );
        socket.emit("createMessage", {
          ...data,
          user: { ...user },
          receiversIds: receivers,
        });
        values.text = "";
      }
      values.text = "";
    },
  });

  let receiverContent;
  let messagesContent;
  if (!receiver) {
    receiverContent = <p>Loading...</p>;
  } else if (receiver) {
    receiverContent = (
      <div className="flex items-center gap-4 mb-4">
        {receiver?.map((r) => (
          <div key={r._id} className="flex items-center gap-2">
            <Link to={`/profile/${r._id}`}>
              <h2 className="inline-block capitalize text-sm sm:text-base">
                {r.name} {r.surname}
              </h2>
            </Link>
            {onlines?.some((o) => o?._id === r?._id) ? (
              <div className="flex items-center justify-center h-5 px-1 bg-green-50 text-green-600 rounded text-xs sm:text-sm font-semibold">
                Online
              </div>
            ) : (
              <div className="flex items-center justify-center h-5 px-1 bg-red-50 text-red-600 rounded text-xs sm:text-sm font-semibold">
                Offline
              </div>
            )}
          </div>
        ))}
      </div>
    );
    if (!messages) {
      messagesContent = <p>Loading...</p>;
    } else if (messages) {
      messagesContent = (
        <div className="p-8 flex flex-col gap-4 h-[calc(100vh-224px)] border border-slate-100 dark:border-slate-900 rounded-lg overflow-y-scroll">
          {messages.map((message) =>
            message.user._id === user?._id ? (
              <div
                key={message._id}
                ref={scrollRef}
                className="flex flex-col self-end">
                <small className="self-end">
                  {user.name} {user.surname}
                </small>
                <div className="flex sm:items-center flex-col-reverse sm:flex-row gap-2">
                  <small className="text-[0.625rem] self-end sm:self-center sm:text-sm text-gray-400 dark:text-gray-700">
                    {dayjs(new Date(message.createdAt).getTime()).fromNow()}
                  </small>
                  <div className="text-xs break-words whitespace-normal sm:text-sm py-2 px-4 max-w-full sm:max-w-xs w-fit self-end bg-indigo-600 text-slate-50 dark:bg-indigo-800 rounded-3xl">
                    {message.text}
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={message._id}
                ref={scrollRef}
                className="flex flex-col self-start">
                <small>
                  {message.user.name} {message.user.surname}
                </small>
                <div className="flex sm:items-center flex-col sm:flex-row gap-2">
                  <div className="text-xs break-words whitespace-normal sm:text-sm py-2 px-4 self-start max-w-full w-fit sm:max-w-xs shadow dark:shadow-white/25 rounded-3xl">
                    {message.text}
                  </div>
                  <small className="text-[0.625rem] sm:text-sm text-gray-400 dark:text-gray-700">
                    {dayjs(new Date(message.createdAt).getTime()).fromNow()}
                  </small>
                </div>
              </div>
            ),
          )}
        </div>
      );
    }
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto pt-8 px-4">
        {receiverContent}
        {messagesContent}
        <Form onSubmit={formik.handleSubmit} className="mt-4">
          <Input
            name="text"
            label="Text"
            placeholder="Type here..."
            onChange={formik.handleChange}
            value={formik.values.text}
            error={false}
          />
          <Button
            disabled={
              !formik.values.text ||
              formik.isSubmitting ||
              !formik.values.text.trim().length
            }
            loading={formik.isSubmitting}
            className="text-xs flex-shrink-0 self-end sm:text-sm">
            Send Message
          </Button>
        </Form>
      </div>
    </>
  );
}

export default Conversation;
