import React from "react";

function Input({ label, error, className, touch, ...props }) {
  return (
    <label className="w-full">
      <div className="text-sm">{label}</div>
      <input
        className={`w-full h-10 px-2 placeholder:text-slate-400 border ${className} ${
          error ? "border-red-600" : "border-slate-200"
        } rounded outline-none`}
        autoComplete="off"
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </label>
  );
}

export default React.memo(Input);
