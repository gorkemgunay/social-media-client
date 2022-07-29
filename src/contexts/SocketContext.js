import { useContext, createContext, useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    if (!socket) {
      setSocket(newSocket);
    }
  }, [socket]);

  const value = useMemo(
    () => ({
      socket,
      setSocket,
    }),
    [socket],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export const useSocketContext = () => useContext(SocketContext);

export default SocketProvider;
