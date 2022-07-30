import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUserContext } from "../contexts/UserContext";
import NotificationsList from "./NotificationsList";
import Notification from "./Notification";
import useAxiosPrivate from "../useAxiosPrivate";
import { useAuthContext } from "../contexts/AuthContext";
import { useSocketContext } from "../contexts/SocketContext";
import ProfileMenu from "./ProfileMenu";

function Header() {
  const [openNotification, setOpenNotification] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const notificationRef = useRef();
  const profileRef = useRef();
  const axiosPrivate = useAxiosPrivate();
  const { setAccessToken } = useAuthContext();
  const { socket, setSocket } = useSocketContext();
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setOpenNotification(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  const handleLogout = async () => {
    const response = await axiosPrivate.post("/user/logout", {
      refreshToken: localStorage.getItem("user"),
    });
    const data = response?.data;
    if (data) {
      localStorage.removeItem("user");
      setAccessToken(null);
      setUser(null);
      setSocket(null);
      socket.disconnect();
      toast.success("Successfully logout.");
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="text-slate-900 border-b border-b-slate-100">
      <nav className="h-10 max-w-2xl px-4 flex items-center justify-between w-full mx-auto">
        <Link to="/">Social Media</Link>
        <ul className="flex items-center gap-8">
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/users">Users</Link>
          </li>

          <li className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => {
                setOpenNotification(!openNotification);
              }}
              className="text-sm font-semibold">
              Notifications
            </button>
            <NotificationsList openNotification={openNotification}>
              <Notification />
              <Notification />
              <Notification />
            </NotificationsList>
          </li>

          <li className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setOpenProfile(!openProfile)}
              className="text-sm font-semibold">
              {user?.name} {user?.surname}
            </button>
            <ProfileMenu
              openProfile={openProfile}
              setOpenProfile={setOpenProfile}
              user={user}
              handleLogout={handleLogout}
            />
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default React.memo(Header);
