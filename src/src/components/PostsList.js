import React from "react";

function PostsList({ children }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

export default React.memo(PostsList);
