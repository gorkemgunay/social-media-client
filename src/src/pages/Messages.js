import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useHandleFetchUserConversations,
  useHandleFetchUserGroupConversations,
} from "../api/conversation";
import { useHandleFetchUser } from "../api/user";
import { Header, Footer, Button } from "../components";
import { useNotificationsContext } from "../contexts/NotificationsContext";
import { useSocketContext } from "../contexts/SocketContext";
import useAxiosPrivate from "../useAxiosPrivate";

function Messages() {
  const { conversations, setConversations } = useHandleFetchUserConversations();
  const { groupConversations } = useHandleFetchUserGroupConversations();
  const { notifications } = useNotificationsContext();
  const { user } = useHandleFetchUser();
  const { socket } = useSocketContext();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("getConversation", (newConversation) => {
      setConversations((prev) => [...prev, newConversation]);
    });
    return () => {
      socket.off("getConversation");
    };
  }, []);

  let conversationsContent;
  let groupConversationsContent;

  if (conversations) {
    conversationsContent = conversations?.map((conversation) => (
      <div key={conversation._id}>
        {conversation.users.map(
          (u) =>
            u._id !== user?._id && (
              <Button
                key={u._id}
                type="button"
                onClick={async () => {
                  const response = await axiosPrivate.post("/conversation", {
                    receiverId: u?._id,
                  });
                  const data = response?.data;
                  if (data) {
                    navigate(`/conversation/${data._id}`);
                  }
                }}
                className="w-full flex items-center sm:justify-between flex-col gap-4 sm:flex-row px-4 py-4 h-24 sm:h-16 bg-white dark:bg-black rounded border border-slate-100 dark:border-slate-900">
                <p className="text-sm font-semibold">
                  {u.name} {u.surname}
                </p>
                {notifications.some(
                  (notification) => notification.sender._id === u._id,
                ) && (
                  <div className="p-2 text-xs text-yellow-600 bg-yellow-50 dark:text-yellow-50 dark:bg-yellow-600 rounded">
                    You have unread messages.
                  </div>
                )}
              </Button>
            ),
        )}
      </div>
    ));
  }

  if (groupConversations) {
    groupConversationsContent = groupConversations?.map((groupConversation) => (
      <div key={groupConversation._id}>
        <Button
          type="button"
          onClick={async () => {
            const receivers = groupConversation.users
              .map((u) => u._id)
              .filter((u) => u !== user._id);
            const response = await axiosPrivate.post("/conversation/group", {
              receiversIds: receivers,
            });
            const data = response?.data;
            if (data) {
              navigate(`/conversation/group/${data._id}`);
            }
          }}
          className="w-full flex items-center sm:justify-between flex-col gap-4 sm:flex-row px-4 py-4 h-24 sm:h-16 bg-white dark:bg-black rounded border border-slate-100 dark:border-slate-900">
          <p className="flex gap-4">
            {groupConversation.users.map(
              (u) =>
                u._id !== user?._id && (
                  <span key={u._id} className="text-sm font-semibold">
                    {u.name} {u.surname}
                  </span>
                ),
            )}
          </p>
        </Button>
      </div>
    ));
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <h2 className="mb-4">Messages</h2>
        <div className="max-h-96 overflow-scroll flex flex-col gap-4">
          {conversationsContent}
        </div>
        <h2 className="my-4">Group Messages</h2>
        <div className="max-h-96 overflow-scroll flex flex-col gap-4">
          {groupConversationsContent}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Messages;
