import React from "react";

function Input({ label = "", error = false, className = "", ...props }) {
  return (
    <label className="w-full">
      <div className="text-sm">{label}</div>
      <input
        className={`w-full h-10 px-2 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:bg-black border ${className} ${
          error ? "border-red-600" : "border-slate-200 dark:border-slate-900"
        } rounded outline-none`}
        autoComplete="off"
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </label>
  );
}

export default React.memo(Input);
