import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Article from "./pages/Article";
import Users from "./pages/Users";
import Conversation from "./pages/Conversation";
import Messages from "./pages/Messages";
import { PersistLogin, Redirect } from "./components";

function App() {
  // const url =
  //   "https://d9olupt5igjta.cloudfront.net/samples/sample_files/71017/6002484fa6ed0e3f78e984542caecdd0a4b3c6b6/mp3/_Discord_Message.mp3?1619010662";
  // const audio = new Audio(url);

  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route index path="/" element={<Home />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/post/:postId" element={<Article />} />
        <Route path="/users" element={<Users />} />
        <Route path="/messages" element={<Messages />} />
        <Route
          path="/conversation/:conversationId"
          element={<Conversation />}
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
