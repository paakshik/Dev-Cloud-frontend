import React from "react";
import { RefreshCw } from "lucide-react";

export default function RefreshButton({ onClick, refreshing }) {
  return <button type="button" onClick={onClick} disabled={refreshing} className="icon-button !min-h-9 !min-w-9" aria-label={refreshing ? "Refreshing" : "Refresh"} title={refreshing ? "Refreshing" : "Refresh"}><RefreshCw size={16} className={refreshing ? "animate-spin" : ""} aria-hidden="true" /></button>;
}
