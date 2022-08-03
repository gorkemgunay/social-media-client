import { Link } from "react-router-dom";

function ProfileMenu({ openProfile, setOpenProfile, user, handleLogout }) {
  return (
    <div
      className={`absolute top-10 right-0 ${
        !openProfile && "hidden"
      } flex flex-col w-48 shadow bg-white dark:bg-slate-900 overflow-hidden rounded`}>
      <Link
        to={`/profile/${user?._id}`}
        onClick={() => setOpenProfile(false)}
        className="flex items-center justify-between gap-1 h-14 px-4 text-xs sm:text-sm cursor-pointer transition-colors bg-white hover:bg-slate-50 dark:bg-slate-900 hover:dark:bg-slate-800">
        Profile
      </Link>

      <Link
        to={`/profile/${user?._id}`}
        onClick={() => setOpenProfile(false)}
        className="flex items-center justify-between gap-1 h-14 px-4 text-xs sm:text-sm cursor-pointer transition-colors bg-white hover:bg-slate-50 dark:bg-slate-900 hover:dark:bg-slate-800">
        Settings
      </Link>

      <button
        type="button"
        onClick={() => handleLogout()}
        className="flex items-center justify-between gap-1 h-14 px-4 text-xs sm:text-sm font-semibold border-t border-slate-100 dark:border-slate-700 cursor-pointer transition-colors hover:bg-slate-50 dark:bg-slate-900 hover:dark:bg-slate-800">
        Logout
      </button>
    </div>
  );
}

export default ProfileMenu;
