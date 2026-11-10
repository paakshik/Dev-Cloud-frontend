import React from "react";

export default function Loader({ label = "Loading", fullScreen = false, size = "md" }) {
  const sizeClass = size === "sm" ? "h-5 w-5 border-2" : "h-9 w-9 border-[3px]";

  return (
    <div
      className={`flex items-center justify-center gap-3 text-indigo-400 ${fullScreen ? "min-h-[50vh]" : "py-8"}`}
      role="status"
      aria-live="polite"
    >
      <span className={`loader-spinner ${sizeClass}`} aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
