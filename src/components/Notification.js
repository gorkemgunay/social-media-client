import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

function Notification() {
  return (
    <div className="flex items-center justify-between gap-1 h-14 px-4 text-sm cursor-pointer transition-colors hover:bg-slate-50">
      <p>
        <Link to="/">Gorkem Gunay</Link> send you a message.
      </p>
      <Button
        type="button"
        className="px-2 h-6 text-xs text-indigo-600 bg-indigo-50 transition-colors hover:bg-indigo-100">
        Delete
      </Button>
    </div>
  );
}

export default React.memo(Notification);
