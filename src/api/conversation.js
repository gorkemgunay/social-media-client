import { useEffect, useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";
import { useUserContext } from "../contexts/UserContext";

export const useHandleFetchConversation = (conversationId) => {
  const [messages, setMessages] = useState(null);
  const [receiver, setReceiver] = useState(null);

  const { user } = useUserContext();

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getConversation = async () => {
      const response = await axiosPrivate.get(
        `/conversation/${conversationId}`,
      );
      const data = response?.data;

      const orderedData = data.messages.sort(
        (a, b) => b.createdAt - a.createdAt,
      );

      setMessages(orderedData);
      const filteredValue = data.users.find(
        (filterReceiver) => user?._id !== filterReceiver?._id,
      );
      setReceiver(filteredValue);
    };
    if (user) {
      getConversation();
    }
  }, [user, conversationId]);

  return { messages, setMessages, receiver, setReceiver };
};

export const useHandleFetchUserConversations = () => {
  const [conversations, setConversations] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getConversations = async () => {
      const response = await axiosPrivate.get("/conversation/user");
      const data = response?.data;
      setConversations(data);
    };
    if (!conversations) {
      getConversations();
    }
  }, [conversations]);

  return { conversations, setConversations };
};
