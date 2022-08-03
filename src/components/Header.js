import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BellIcon,
  ChatAlt2Icon,
  HomeIcon,
  MoonIcon,
  SunIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { useUserContext } from "../contexts/UserContext";
import NotificationsList from "./NotificationsList";
import useAxiosPrivate from "../useAxiosPrivate";
import { useAuthContext } from "../contexts/AuthContext";
import { useSocketContext } from "../contexts/SocketContext";
import ProfileMenu from "./ProfileMenu";
import { useNotificationsContext } from "../contexts/NotificationsContext";

function Header() {
  const [openNotification, setOpenNotification] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem("theme") || false,
  );
  const notificationRef = useRef();
  const profileRef = useRef();
  const axiosPrivate = useAxiosPrivate();
  const { setAccessToken } = useAuthContext();
  const { socket, setSocket } = useSocketContext();
  const { user, setUser } = useUserContext();
  const { notifications } = useNotificationsContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!darkTheme) {
      localStorage.removeItem("theme");
      document.documentElement.classList.remove("dark");
    } else {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    }
  }, [darkTheme]);

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
    <header className="text-slate-900 dark:text-slate-50 border-b border-b-slate-100 dark:border-b-slate-900">
      <nav className="h-10 max-w-4xl px-4 flex items-center justify-center sm:justify-between w-full mx-auto">
        <Link to="/" className="hidden sm:inline-block">
          Social Media
        </Link>
        <ul className="flex items-center gap-5 sm:gap-8">
          <li className="relative group">
            <Link to="/">
              <HomeIcon className="w-6 h-6" />
            </Link>
            <span className="absolute hidden text-xs font-semibold px-2 py-0.5 w-fit bg-black dark:bg-white rounded text-slate-50 dark:text-slate-900 -bottom-9 left-1/2 -translate-x-1/2 sm:group-hover:flex items-center justify-center">
              Home
            </span>
          </li>

          <li className="relative group">
            <Link to="/users">
              <UserGroupIcon className="w-6 h-6" />
            </Link>

            <span className="absolute hidden text-xs font-semibold px-2 py-0.5 w-fit bg-black dark:bg-white rounded text-slate-50 dark:text-slate-900 -bottom-9 left-1/2 -translate-x-1/2 sm:group-hover:flex items-center justify-center">
              Users
            </span>
          </li>

          <li className="relative group">
            <Link to="/messages">
              <ChatAlt2Icon className="w-6 h-6" />
            </Link>

            <span className="absolute hidden text-xs font-semibold px-2 py-0.5 w-fit bg-black dark:bg-white rounded text-slate-50 dark:text-slate-900 -bottom-9 left-1/2 -translate-x-1/2 sm:group-hover:flex items-center justify-center">
              Messages
            </span>
          </li>

          <li className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => {
                setOpenNotification(!openNotification);
              }}
              className="flex items-center text-sm font-semibold relative group">
              <BellIcon className="w-6 h-6" />
              {!openNotification && (
                <span className="absolute hidden text-xs font-semibold px-2 py-0.5 w-fit bg-black dark:bg-white rounded text-slate-50 dark:text-slate-900 top-10 left-1/2 -translate-x-1/2 sm:group-hover:flex items-center justify-center">
                  Notifications
                </span>
              )}
            </button>
            <NotificationsList
              openNotification={openNotification}
              setOpenNotification={setOpenNotification}
            />
            {notifications.length !== 0 && (
              <span className="flex items-center justify-center text-[10px] font-bold absolute bg-red-600 w-3 h-3 text-slate-50 rounded-full -bottom-[7.5px] left-1/2 -translate-x-1/2 z-0 pointer-events-none">
                {notifications.length}
              </span>
            )}
          </li>

          <li>
            <button
              type="button"
              onClick={() => {
                if (darkTheme) {
                  localStorage.removeItem("theme");
                  setDarkTheme(false);
                } else {
                  localStorage.setItem("theme", "dark");
                  setDarkTheme(localStorage.getItem("theme"));
                }
              }}
              className="relative flex items-center text-sm group font-semibold">
              {localStorage.getItem("theme") ? (
                <>
                  <SunIcon className="w-6 h-6" />
                  <span className="absolute hidden text-xs font-semibold px-2 py-0.5 w-fit bg-black dark:bg-white rounded text-slate-50 dark:text-slate-900 top-10 left-1/2 -translate-x-1/2 sm:group-hover:flex items-center justify-center">
                    Light
                  </span>
                </>
              ) : (
                <>
                  <MoonIcon className="w-6 h-6" />

                  <span className="absolute hidden text-xs font-semibold px-2 py-0.5 w-fit bg-black dark:bg-white rounded text-slate-50 dark:text-slate-900 top-10 left-1/2 -translate-x-1/2 sm:group-hover:flex items-center justify-center">
                    Dark
                  </span>
                </>
              )}
            </button>
          </li>

          <li className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setOpenProfile(!openProfile)}
              className="relative flex items-center group text-sm font-semibold">
              <UserIcon className="w-6 h-6" />
              {!openProfile && (
                <span className="absolute hidden text-xs font-semibold px-2 py-0.5 w-fit bg-black dark:bg-white rounded text-slate-50 dark:text-slate-900 top-10 left-1/2 -translate-x-1/2 sm:group-hover:flex items-center justify-center">
                  {user?.name} {user?.surname}
                </span>
              )}
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
