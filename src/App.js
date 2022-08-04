import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Article from "./pages/Article";
import Users from "./pages/Users";
import Conversation from "./pages/Conversation";
import GroupConversation from "./pages/GroupConversation";
import Messages from "./pages/Messages";
import ProfileSettings from "./pages/ProfileSettings";
import { PersistLogin, Redirect } from "./components";

function App() {
  useEffect(() => {
    const dark = localStorage.getItem("theme");
    if (dark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route index path="/" element={<Home />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/profile/settings/:userId" element={<ProfileSettings />} />
        <Route path="/post/:postId" element={<Article />} />
        <Route path="/users" element={<Users />} />
        <Route path="/messages" element={<Messages />} />
        <Route
          path="/conversation/:conversationId"
          element={<Conversation />}
        />
        <Route
          path="/conversation/group/:conversationId"
          element={<GroupConversation />}
        />
      </Route>
      <Route element={<Redirect />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
