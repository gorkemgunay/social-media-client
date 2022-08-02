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
  const [online, setOnline] = useState(false);
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
      const isOnline = onlineUsers.some((u) => u._id === receiver?._id);
      setOnline(isOnline);
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
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

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
        const notification = await axiosPrivate.post("/notification", {
          type: "message",
          receiverId: receiver._id,
        });
        socket.emit("createMessage", {
          ...data,
          receiverId: receiver._id,
        });
        socket.emit("createMessageNotification", {
          ...notification?.data,
          sender: user,
        });
        values.text = "";
      }
      values.text = "";
    },
  });

  useEffect(() => {
    const getFilteredNotification = notifications.find(
      (n) => n.receiver === user?._id && n.sender._id === receiver?._id,
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
  }, [user, receiver, notifications]);

  let receiverContent;
  let messagesContent;
  if (!receiver) {
    receiverContent = <p>Loading...</p>;
  } else if (receiver) {
    receiverContent = (
      <div className="flex items-center gap-4 mb-4">
        <Link to={`/profile/${receiver._id}`}>
          <h2 className="inline-block capitalize">
            {receiver.name} {receiver.surname}
          </h2>
        </Link>
        <p
          className={`text-sm rounded px-2 font-semibold ${
            online
              ? "!bg-green-100 !text-green-600"
              : "!bg-red-100 !text-red-600"
          }`}>
          {online ? "Online" : "Offline"}
        </p>
      </div>
    );
    if (!messages) {
      messagesContent = <p>Loading...</p>;
    } else if (messages) {
      messagesContent = (
        <div className="p-8 flex flex-col gap-4 h-[calc(100vh-224px)] border border-slate-100 dark:border-slate-900 rounded-lg overflow-y-scroll">
          {messages.map((message) =>
            message.user === user?._id ? (
              <div
                key={message._id}
                ref={scrollRef}
                className="flex flex-col self-end">
                <small className="self-end">
                  {user.name} {user.surname}
                </small>
                <div className="flex items-center gap-2">
                  <small className="text-xs text-gray-400 dark:text-gray-700">
                    {dayjs(new Date(message.createdAt).getTime()).fromNow()}
                  </small>
                  <p className="py-2 px-4 max-w-xs self-end bg-indigo-600 text-slate-50 dark:bg-indigo-800 rounded-3xl">
                    {message.text}
                  </p>
                </div>
              </div>
            ) : (
              <div key={message._id} ref={scrollRef} className="flex flex-col">
                <small>
                  {receiver.name} {receiver.surname}
                </small>
                <div className="flex items-center gap-2">
                  <p className="py-2 px-4 w-fit max-w-xs shadow dark:shadow-white/25 rounded-3xl">
                    {message.text}
                  </p>
                  <small className="text-xs text-gray-400 dark:text-gray-700">
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
            className="text-sm flex-shrink-0 self-end">
            Send Message
          </Button>
        </Form>
      </div>
    </>
  );
}

export default Conversation;
