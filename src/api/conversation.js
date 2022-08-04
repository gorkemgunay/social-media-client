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
      const messagesData = data.messages;

      setMessages(messagesData);

      if (data.users.length === 2) {
        const filteredValue = data.users.filter(
          (filterReceiver) => user?._id !== filterReceiver?._id,
        );
        setReceiver(filteredValue);
      } else {
        const filteredValue = data.users.filter(
          (filterReceiver) => user?._id !== filterReceiver?._id,
        );
        setReceiver(filteredValue);
      }
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

export const useHandleFetchGroupConversations = () => {
  const [groupConversations, setGroupConversations] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getGroupConversations = async () => {
      const response = await axiosPrivate.get("/conversation/group");
      const data = response?.data;
      setGroupConversations(data);
    };
    if (!groupConversations) {
      getGroupConversations();
    }
  }, [groupConversations]);

  return { groupConversations, setGroupConversations };
};

export const useHandleFetchUserGroupConversations = () => {
  const [groupConversations, setGroupConversations] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getGroupConversations = async () => {
      const response = await axiosPrivate.get("/conversation/group");
      const data = response?.data;
      setGroupConversations(data);
    };
    if (!groupConversations) {
      getGroupConversations();
    }
  }, [groupConversations]);

  return { groupConversations, setGroupConversations };
};
