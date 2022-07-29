import React from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

function Header() {
  const { user } = useUserContext();

  return (
    <header className="text-slate-900 border-b border-b-slate-100">
      <nav className="h-10 max-w-2xl flex items-center justify-between w-full mx-auto">
        <Link to="/">Social Media</Link>
        <ul className="flex items-center gap-8">
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/users">Users</Link>
          </li>

          <li>
            <Link to={`/profile/${user?._id}`}>Profile</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default React.memo(Header);
