import React from "react";

function Form({ onSubmit, children, className, ...props }) {
  return (
    <form className={`flex gap-4 ${className}`} onSubmit={onSubmit} {...props}>
      {children}
    </form>
  );
}

export default React.memo(Form);
