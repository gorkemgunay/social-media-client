import React from "react";

function NotificationsList({ openNotification, children }) {
  return (
    <div
      className={`absolute top-10 right-0 ${
        !openNotification && "hidden"
      } flex flex-col w-80 shadow bg-white rounded`}>
      {children}
    </div>
  );
}

export default React.memo(NotificationsList);
