import React from "react";

function Textarea({ label, error, ...props }) {
  return (
    <label>
      <div className="text-sm">{label}</div>
      <textarea
        className={`w-full resize-none p-2 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:bg-black border ${
          error ? "border-red-600" : "border-slate-200 dark:border-slate-900"
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
