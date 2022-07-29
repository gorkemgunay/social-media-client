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
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
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
