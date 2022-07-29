import React from "react";

function CommentsList({ children }) {
  return (
    <div className="flex flex-col gap-2 max-h-96 overflow-scroll">
      {children}
    </div>
  );
}

export default React.memo(CommentsList);
