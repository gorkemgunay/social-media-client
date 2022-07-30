import { Link } from "react-router-dom";

function ProfileMenu({ openProfile, setOpenProfile, user, handleLogout }) {
  return (
    <div
      className={`absolute top-10 right-0 ${
        !openProfile && "hidden"
      } flex flex-col w-48 shadow bg-white rounded`}>
      <Link
        to={`/profile/${user?._id}`}
        onClick={() => setOpenProfile(false)}
        className="flex items-center justify-between gap-1 h-14 px-4 text-sm cursor-pointer transition-colors hover:bg-slate-50">
        Profile
      </Link>

      <Link
        to={`/profile/${user?._id}`}
        onClick={() => setOpenProfile(false)}
        className="flex items-center justify-between gap-1 h-14 px-4 text-sm cursor-pointer transition-colors hover:bg-slate-50">
        Settings
      </Link>

      <button
        type="button"
        onClick={() => handleLogout()}
        className="flex items-center justify-between gap-1 h-14 px-4 text-sm font-semibold border-t border-slate-100 cursor-pointer transition-colors hover:bg-slate-50">
        Logout
      </button>
    </div>
  );
}

export default ProfileMenu;
