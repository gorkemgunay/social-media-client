import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button";

function Likes({ likes, setShowLikes }) {
  return (
    <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center transition-all bg-black/40">
      <div className="max-w-4xl w-full px-4">
        <div className="max-w-4xl w-full flex-col p-8 bg-white dark:bg-slate-900 rounded-xl">
          <h3 className="mb-4">Likes</h3>
          <div className="flex flex-col gap-4 max-h-96 overflow-scroll">
            {likes.map((like) => (
              <div
                key={like._id}
                className="flex items-center justify-between gap-4 px-4 h-16 rounded bg-white dark:bg-black border border-slate-100 dark:border-slate-900">
                <p className="text-xs sm:text-sm font-semibold">
                  {like.user.name} {like.user.surname}
                </p>

                <Link
                  to={`/profile/${like.user._id}`}
                  onClick={() => setShowLikes(false)}
                  className="primary-small-btn rounded flex items-center">
                  Profile
                </Link>
              </div>
            ))}
          </div>
          <Button
            type="button"
            className="bg-red-500 dark:bg-red-700 w-full text-xs mt-4 h-6 sm:h-10 sm:text-sm"
            onClick={() => setShowLikes(false)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Likes);
