import { useContext, createContext, useState, useMemo } from "react";

const NotificationsContext = createContext();

function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const value = useMemo(
    () => ({
      notifications,
      setNotifications,
    }),
    [notifications],
  );
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotificationsContext = () => useContext(NotificationsContext);

export default NotificationsProvider;
