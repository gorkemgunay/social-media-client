import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button";

function Followers({ followers, setShowFollowers }) {
  return (
    <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center transition-all bg-black/40">
      <div className="max-w-2xl w-full flex-col p-8 bg-white rounded-xl">
        <h3 className="mb-4">Followers</h3>
        <div className="flex flex-col gap-4 max-h-96 overflow-scroll">
          {followers.map((follower) => (
            <div
              key={follower._id}
              className="flex items-center justify-between gap-4 px-4 h-16 rounded border border-slate-100">
              <p className="text-sm font-semibold capitalize">
                {follower.name} {follower.surname}
              </p>

              <Link
                to={`/profile/${follower._id}`}
                onClick={() => setShowFollowers(false)}
                className="flex items-center justify-center whitespace-nowrap
              rounded disabled:bg-indigo-50 disabled:text-indigo-600
              disabled:cursor-not-allowed px-2 h-6 text-xs text-indigo-600
              bg-indigo-50 transition-colors hover:bg-indigo-100">
                Profile
              </Link>
            </div>
          ))}
        </div>
        <Button
          type="button"
          className="w-full bg-red-500 text-sm mt-4"
          onClick={() => setShowFollowers(false)}>
          Close
        </Button>
      </div>
    </div>
  );
}

export default React.memo(Followers);
