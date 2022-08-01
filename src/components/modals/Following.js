import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button";

function Following({ following, setShowFollowing }) {
  return (
    <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center transition-all bg-black/40">
      <div className="max-w-4xl w-full flex-col p-8 bg-white dark:bg-slate-900 rounded-xl">
        <h3 className="mb-4">Following</h3>
        <div className="flex flex-col gap-4 max-h-96 overflow-scroll">
          {following.map((follower) => (
            <div
              key={follower._id}
              className="flex items-center justify-between gap-4 px-4 h-16 rounded bg-white dark:bg-black border border-slate-100 dark:border-slate-900">
              <p className="text-sm font-semibold capitalize">
                {follower.name} {follower.surname}
              </p>
              <Link
                to={`/profile/${follower._id}`}
                onClick={() => setShowFollowing(false)}
                className="primary-small-btn rounded flex items-center">
                Profile
              </Link>
            </div>
          ))}
        </div>
        <Button
          type="button"
          className="bg-red-500 dark:bg-red-600 w-full text-sm mt-4"
          onClick={() => setShowFollowing(false)}>
          Close
        </Button>
      </div>
    </div>
  );
}

export default React.memo(Following);
