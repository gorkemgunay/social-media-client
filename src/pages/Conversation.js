import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { Link, useParams } from "react-router-dom";
import useAxiosPrivate from "../useAxiosPrivate";
import { Header, Form, Input, Button } from "../components";
import { useSocketContext } from "../contexts/SocketContext";
import { useHandleFetchUser } from "../api/user";
import { useHandleFetchConversation } from "../api/conversation";

function Conversation() {
  const axiosPrivate = useAxiosPrivate();
  const { conversationId } = useParams();
  const { messages, setMessages, receiver } =
    useHandleFetchConversation(conversationId);
  const { user } = useHandleFetchUser();
  const { socket } = useSocketContext();
  const scrollRef = useRef();

  useEffect(() => {
    if (user) {
      socket.emit("userConnect", user);
    }
  }, [user]);

  useEffect(() => {
    socket.on("getNewMessage", (newMessage) => {
      if (newMessage.conversation === conversationId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });
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
        socket.emit("createMessage", {
          ...data,
          receiverId: receiver._id,
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
      <div>
        <Link to={`/profile/${receiver._id}`}>
          <h2 className="mb-4 inline-block capitalize">
            {receiver.name} {receiver.surname}
          </h2>
        </Link>
      </div>
    );
    if (!messages) {
      messagesContent = <p>Loading...</p>;
    } else if (messages) {
      messagesContent = (
        <div className="p-8 flex flex-col gap-4 h-[calc(100vh-224px)] border border-slate-100 rounded-lg overflow-y-scroll">
          {messages.map((message) =>
            message.user === user?._id ? (
              <div
                key={message._id}
                ref={scrollRef}
                className="flex flex-col self-end">
                <small className="self-end">
                  {user.name} {user.surname}
                </small>
                <p className="py-2 px-4 w-fit max-w-xs self-end bg-indigo-600 text-slate-50 rounded-3xl">
                  {message.text}
                </p>
              </div>
            ) : (
              <div key={message._id} ref={scrollRef} className="flex flex-col">
                <small>
                  {receiver.name} {receiver.surname}
                </small>
                <p className="py-2 px-4 w-fit max-w-xs shadow rounded-3xl">
                  {message.text}
                </p>
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
      <div className="max-w-2xl mx-auto pt-8 px-4">
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
