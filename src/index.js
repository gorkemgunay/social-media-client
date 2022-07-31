import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import UserProvider from "./contexts/UserContext";
import AuthProvider from "./contexts/AuthContext";
import SocketProvider from "./contexts/SocketContext";
import NotificationsProvider from "./contexts/NotificationsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <UserProvider>
        <SocketProvider>
          <NotificationsProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <App />
          </NotificationsProvider>
        </SocketProvider>
      </UserProvider>
    </AuthProvider>
  </BrowserRouter>,
);
