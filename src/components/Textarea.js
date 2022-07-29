import React from "react";

function Textarea({ label, error, ...props }) {
  return (
    <label>
      <div className="text-sm">{label}</div>
      <textarea
        className={`w-full resize-none p-2 placeholder:text-slate-400 border ${
          error ? "border-red-600" : "border-slate-200"
        } rounded outline-none`}
        autoComplete="off"
        rows={10}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </label>
  );
}

export default React.memo(Textarea);
