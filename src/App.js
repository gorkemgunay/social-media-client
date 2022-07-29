import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Article from "./pages/Article";
import Users from "./pages/Users";
import Conversation from "./pages/Conversation";
import { PersistLogin, Redirect } from "./components";

function App() {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route index path="/" element={<Home />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/post/:postId" element={<Article />} />
        <Route path="/users" element={<Users />} />
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
