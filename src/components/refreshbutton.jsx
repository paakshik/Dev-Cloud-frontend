import React from "react";
import { motion } from "framer-motion";

export default function RefreshButton({ onClick, refreshing }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      disabled={refreshing}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold 
        text-white transition-all duration-300
        ${refreshing
          ? "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-90 cursor-not-allowed"
          : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 hover:shadow-lg shadow-md shadow-indigo-900/40 hover:shadow-pink-700/40"
        }`}
    >
      {refreshing ? (
        <>
          {/* 🔄 Clean modern loader */}
          <motion.svg
            className="w-5 h-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v3l3-3-3-3v3a8 8 0 00-8 8z"
            ></path>
          </motion.svg>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm tracking-wide"
          >
            Refreshing...
          </motion.span>
        </>
      ) : (
        <>
          {/* 🔁 Static refresh icon */}
          <svg
            className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0114-8"
            />
          </svg>
          <span className="text-sm tracking-wide">Refresh</span>
        </>
      )}
    </motion.button>
  );
}
